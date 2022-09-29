export class BadRequestError extends Error {
  statusCode: 400;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
