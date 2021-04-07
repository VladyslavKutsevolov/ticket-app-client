export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor() {
    super();
    Object.setPrototypeOf(this, CustomError);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
