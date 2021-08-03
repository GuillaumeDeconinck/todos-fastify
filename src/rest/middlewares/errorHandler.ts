import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { ApplicationError } from "../../application/errors/ApplicationError";
import { Logger } from "../../tools/logger";
import { HttpError } from "../errors/HttpError";

@singleton()
export class ErrorHandlerMiddleware {
  constructor(@inject(Logger) private logger: Logger) {
    this.handleError = this.handleError.bind(this);
  }

  handleError(
    error: Error | HttpError | ApplicationError,
    _req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    this.logger.logger.error(error);
    let httpError: HttpError;
    if (error instanceof HttpError) {
      httpError = error;
    } else if (error instanceof ApplicationError) {
      httpError = HttpError.fromApplicationError(error);
    } else {
      httpError = new HttpError(error.message);
    }
    const errorToSend = httpError.toExposedError();
    reply.code(errorToSend.statusCode).send(errorToSend);
  }
}
