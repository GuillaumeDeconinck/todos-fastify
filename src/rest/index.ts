import fastify, { FastifyInstance } from "fastify";
import { inject, singleton } from "tsyringe";
import { AppConfiguration } from "../tools/config";
import { Logger } from "../tools/logger";
import { setupRoutes } from "./routes";

@singleton()
export class RestServer {
  fastifyInstance?: FastifyInstance;

  constructor(@inject(AppConfiguration) private config: AppConfiguration, @inject(Logger) private logger: Logger) {}

  async setupRest(): Promise<void> {
    // Disable logger because we want to avoid the default log of `.listen(...)`
    this.fastifyInstance = fastify({ logger: false });

    setupRoutes(this.fastifyInstance);

    const port = this.config.getAppConfig().apiPort;
    await this.fastifyInstance.listen(port, "0.0.0.0");

    // Re-setup logger in order to have log for each request
    this.fastifyInstance.log = this.logger.logger;
  }

  async closeRestServer(): Promise<void> {
    if (!this.fastifyInstance) {
      return;
    }

    await this.fastifyInstance.close();
    delete this.fastifyInstance;
  }
}
