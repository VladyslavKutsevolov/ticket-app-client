import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("Ticket creating", () => {
  it("should have a route handler to /api/tickets for post request", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toEqual(404);
  });

  it("should not be accessed if user signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("should be accessed if user signed in", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({});

    expect(res).not.toEqual(401);
  });
  it("should return err if invalid title provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        price: 10,
      })
      .expect(400);
  });
  it("should return err if invalid price provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "title",
        price: -1,
      })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "title",
      })
      .expect(400);
  });

  it("should create a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "afdsa", price: "20" })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
  });

  it("should publish events", async () => {
    const title = "afdsfa";
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price: "20" })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
