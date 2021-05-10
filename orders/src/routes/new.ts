import express, { Response, Request } from "express";
import { requireAuth, validateRequest } from "@vladtickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("ticketId must be provided"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
