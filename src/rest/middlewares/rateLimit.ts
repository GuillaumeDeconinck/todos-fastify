import { FastifyReply, FastifyRequest } from "fastify";
import NodeCache from "node-cache";
import { inject, singleton } from "tsyringe";
import { AppConfiguration } from "../../tools/config";
import { Logger } from "../../tools/logger";

@singleton()
export class RateLimitMiddleware {
  private cache: NodeCache;

  constructor(
    @inject(Logger) private logger: Logger,
    @inject(AppConfiguration) private configuration: AppConfiguration
  ) {
    this.cache = new NodeCache({
      deleteOnExpire: true,
      maxKeys: 1000
    });

    this.applyRateLimit = this.applyRateLimit.bind(this);
  }

  async applyRateLimit(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const externalIP = this.extractIp(request);
    if (!externalIP) {
      const error = new Error("Missing IP address");
      reply.status(400).send(error);
      throw error;
    }
    const counter = this.cache.get<number>(externalIP) ?? 0;
    this.cache.set(externalIP, counter + 1, this.configuration.getAppConfig().apiRateLimitTTL);

    if (counter > this.configuration.getAppConfig().apiMaxRequestsPerTTL) {
      this.logger.logger.error(`IP ${externalIP} is sending too many requests`);
      const error = new Error("Rate limited");
      reply.status(403).send(error);
      throw error;
    }
  }

  private extractIp(request: FastifyRequest): string {
    return (request.headers["x-forwarded-for"] as string)?.split(",").shift() || request.socket?.remoteAddress;
  }
}
