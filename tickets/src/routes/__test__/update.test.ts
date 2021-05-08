import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("Ticket Update", () => {
  it("should return 404 if provide if not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", global.signin())
      .send({ title: "sds", price: 20 })
      .expect(404);
  });

  it("should return 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app)
      .put(`/api/tickets/${id}`)
      .send({ title: "sds", price: 20 })
      .expect(401);
  });
  it("should return 401 if user not own ticket", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "sasa", price: 20 });

    await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set("Cookie", global.signin())
      .send({ title: "sdsad", price: 10 })
      .expect(401);
  });

  it("should return 400 if user provide title or price", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "sasa", price: 20 });

    await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "dsadsa", price: -1 })
      .expect(400);
  });

  it("should update ticket", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "sasa", price: 20 });

    await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "dsadsa", price: 10 })
      .expect(200);

    const ticketsRes = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .send();

    expect(ticketsRes.body.title).toEqual("dsadsa");
    expect(ticketsRes.body.price).toEqual(10);
  });
});
