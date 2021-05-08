import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import {
  NotAuthorizedErr,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@vladtickets/common";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title can not be empty"),
    body("price").isFloat({ gt: 0 }).withMessage("Price should be grater 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedErr();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketsRouter };
