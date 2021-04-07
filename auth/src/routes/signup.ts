import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidataionError } from "../errors/request-validataion";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidataionError(errors.array());
    }

    const { email, password } = req.body;

    console.log("creating user");
    throw new DatabaseConnectionError();
    res.send({});
  }
);

export { router as signupRouter };
