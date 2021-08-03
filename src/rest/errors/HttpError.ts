import { ApplicationError, ApplicationErrorType } from "../../application/errors/ApplicationError";

interface HttpErrorType {
  readonly code: number;
  readonly name: string;
}

const HttpErrorTypeMap: { [s: string]: HttpErrorType } = {
  BAD_REQUEST: {
    code: 400,
    name: "Bad Request"
  },
  NOT_FOUND: {
    code: 404,
    name: "Not found"
  },
  RATE_LIMITED: {
    code: 429,
    name: "Rate limited"
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    name: "Internal server error"
  }
};

interface ExposedError {
  statusCode: number;
  error: string;
  message: string;
}

export class HttpError extends Error {
  errorType: HttpErrorType;

  constructor(message: string, errorType: HttpErrorType = HttpErrorTypeMap.INTERNAL_SERVER_ERROR) {
    super(message);
    this.errorType = errorType;
  }

  toExposedError(): ExposedError {
    return {
      statusCode: this.errorType.code,
      error: this.errorType.name,
      message: this.message
    };
  }

  static fromApplicationError(error: ApplicationError): HttpError {
    const httpError = new HttpError(error.message);
    switch (error.errorType) {
      case ApplicationErrorType.BAD_REQUEST:
        httpError.errorType = HttpErrorTypeMap.BAD_REQUEST;
        break;
      case ApplicationErrorType.NOT_FOUND:
        httpError.errorType = HttpErrorTypeMap.NOT_FOUND;
        break;
      default:
        httpError.errorType = HttpErrorTypeMap.INTERNAL_SERVER_ERROR;
        break;
    }
    return httpError;
  }
}
