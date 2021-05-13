import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../model/Order";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@vladtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "afaf",
    price: 2,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: "ada",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    msg,
    data,
    order,
    listener,
  };
};

it("should change status of the order", async () => {
  const { msg, order, listener, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("should change status of the order", async () => {
  const { msg, order, listener, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
