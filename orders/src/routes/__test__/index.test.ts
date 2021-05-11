import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const ticketCreate = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "ticket",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

describe("List all orders per user", () => {
  it("should list orders for a particular user", async () => {
    const ticket1 = await ticketCreate();
    const ticket2 = await ticketCreate();
    const ticket3 = await ticketCreate();

    const user1 = global.signin();
    const user2 = global.signin();

    await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({ ticketId: ticket1.id })
      .expect(201);

    const { body: order1 } = await request(app)
      .post("/api/orders")
      .set("Cookie", user2)
      .send({ ticketId: ticket2.id })
      .expect(201);

    const { body: order2 } = await request(app)
      .post("/api/orders")
      .set("Cookie", user2)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const res = await request(app)
      .get("/api/orders")
      .set("Cookie", user2)
      .expect(200);

    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(order1.id);
    expect(res.body[1].id).toEqual(order2.id);
  });
});
