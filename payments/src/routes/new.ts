import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedErr,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vladtickets/common";
import { body } from "express-validator";
import { Order } from "../model/Order";
import { stripe } from "../stripe";
import { Payment } from "../model/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty().withMessage("Token must be present")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedErr();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as paymentNewRouter };
