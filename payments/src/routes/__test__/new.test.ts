import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../model/Order";
import { OrderStatus } from "@vladtickets/common";

describe("Payment creation", () => {
  it("should return 404 if order not exist", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        token: "sdsf",
        orderId: mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });
  it("should return 401 if order not belong to a user", async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId: mongoose.Types.ObjectId().toHexString(),
      price: 2,
    });

    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        token: "sdsf",
        orderId: order.id,
      })
      .expect(401);
  });
  it("should return 400 if purchasing cancelled order", async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Cancelled,
      version: 0,
      userId,
      price: 2,
    });

    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({
        orderId: order.id,
        token: ";aads",
      })
      .expect(400);
  });
});
