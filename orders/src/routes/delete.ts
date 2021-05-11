import express, { Response, Request } from "express";
import {
  NotAuthorizedErr,
  NotFoundError,
  requireAuth,
} from "@vladtickets/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../event/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedErr();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.ticket.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
