import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("Show ticket by Id", () => {
  it("should return 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it("should return ticket if ticket exist", async () => {
    const title = "title";
    const price = 20;
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    const ticketRes = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .send()
      .expect(200);

    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);
  });
});
