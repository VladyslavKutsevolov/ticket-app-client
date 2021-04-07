import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidataionError } from "../errors/request-validataion";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidataionError) {
    const errors = err.errors.map((e) => {
      return { message: e.msg, field: e.param };
    });

    return res.status(400).send({ errors });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
