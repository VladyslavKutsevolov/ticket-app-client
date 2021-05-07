import request from "supertest";
import { app } from "../../app";

describe("Show ticket by Id", () => {
  it("should return 404 if ticket is not found", async () => {
    await request(app).get("/api/tickets/afsafd").send().expect(404);
  });
  it("should return ticket if ticket is found", async () => {
    const title = "title";
    const price = 20;
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    const ticketRes = await request(app)
      .get(`/api.tickets/${res.body.id}`)
      .send()
      .expect(200);

    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);
  });
});
