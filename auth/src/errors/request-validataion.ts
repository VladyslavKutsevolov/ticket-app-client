import { ValidationError } from "express-validator";

export class RequestValidataionError extends Error {
  constructor(public errors: ValidationError[]) {
    super();
    //Because we extending build ifn Class
    Object.setPrototypeOf(this, RequestValidataionError.prototype);
  }
}
