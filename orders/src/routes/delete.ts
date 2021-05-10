import express, { Response, Request } from "express";
import {
  NotAuthorizedErr,
  NotFoundError,
  requireAuth,
} from "@vladtickets/common";
import { Order } from "../models/order";
import { OrderStatus } from "../../../common";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedErr();
    }

    order.status = OrderStatus.Cancelled;

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
