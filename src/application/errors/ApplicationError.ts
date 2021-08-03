export enum ApplicationErrorType {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}

export class ApplicationError extends Error {
  readonly errorType: ApplicationErrorType;

  constructor(message: string, errorType: ApplicationErrorType) {
    super(message);
    this.errorType = errorType;
  }
}
