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
    return res.status(err.statusCode).send({ errors: err.serialize() });
  }
  //
  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serialize() });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
