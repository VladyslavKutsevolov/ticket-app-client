import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  public reason = "Error connection to database";
  public statusCode = 500;

  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
