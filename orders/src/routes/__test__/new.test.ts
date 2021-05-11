import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@vladtickets/common";
import { natsWrapper } from "../../nats-wrapper";

describe("Order creation", () => {
  it("should return err if ticket is not exist", async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId })
      .expect(404);
  });
  it("should return err if ticket is already reserved", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "vlad",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("should reserve ticket", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it("should emits an order created event", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
