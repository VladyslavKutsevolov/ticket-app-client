export class DatabaseConnectionError extends Error {
  public reason = "Error connection to database";
  public statusCode = 500;

  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
