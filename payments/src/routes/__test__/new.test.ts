import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../model/Order";
import { OrderStatus } from "@vladtickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../model/payments";

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

  it("should return 204 with valid inputs", async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 10000);

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId,
      price,
    });

    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({
        orderId: order.id,
        token: "tok_visa",
      })
      .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });

    const stripeCharge = stripeCharges.data.find(
      (charge) => charge.amount === price * 100
    );

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("usd");

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: stripeCharge!.id,
    });

    expect(payment).not.toBeNull();
  });
});
