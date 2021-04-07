import { ValidationError } from "express-validator";

export class RequestValidataionError extends Error {
  public statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();
    //Because we extending build ifn Class
    Object.setPrototypeOf(this, RequestValidataionError.prototype);
  }

  serialize() {
    return this.errors.map((e) => {
      return {
        message: e.msg,
        field: e.param,
      };
    });
  }
}
