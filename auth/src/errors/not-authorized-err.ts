import { CustomError } from "./custom-error";

export class NotAuthorizedErr extends CustomError {
  public statusCode = 401;
  constructor() {
    super("not authorized");
    Object.setPrototypeOf(this, NotAuthorizedErr.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: "Not authorized" }];
  }
}
