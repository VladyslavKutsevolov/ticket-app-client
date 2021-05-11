import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

describe("Display single ticket", () => {
  it("should fetch order", async () => {
    const userID = global.signin();

    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "price",
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", userID)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", userID)
      .send()
      .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
  });

  it("should return err if one user fetch other user order", async () => {
    const userID = global.signin();

    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "price",
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", userID)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(401);
  });
});
