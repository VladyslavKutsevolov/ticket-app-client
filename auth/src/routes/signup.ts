import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidataionError } from "../errors/request-validataion";

import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be valid"),

    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password should be between 4 an 20"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidataionError(errors.array());
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("email in use");
    }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
