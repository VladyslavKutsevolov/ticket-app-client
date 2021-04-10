import { Request, Response, NextFunction } from "express";
import { NotAuthorizedErr } from "../errors/not-authorized-err";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedErr();
  }
  next();
};
