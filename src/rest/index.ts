import fastify, { FastifyInstance } from "fastify";
import fastifyCors, { FastifyCorsOptions } from "fastify-cors";
import fastifySwagger from "fastify-swagger";
import { inject, singleton } from "tsyringe";
import { AppConfiguration } from "../tools/config";
import { Logger } from "../tools/logger";
import { setupRoutes } from "./routes";

const corsOptions: FastifyCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  credentials: true
};

@singleton()
export class RestServer {
  fastifyInstance?: FastifyInstance;

  constructor(@inject(AppConfiguration) private config: AppConfiguration, @inject(Logger) private logger: Logger) {}

  async setupRest(): Promise<void> {
    // Disable logger because we want to avoid the default log of `.listen(...)`
    this.fastifyInstance = fastify({ logger: false });

    // Global middlewares
    this.fastifyInstance.register(fastifyCors, corsOptions);
    this.fastifyInstance.register(fastifySwagger, {
      routePrefix: "/docs",
      swagger: {
        info: {
          title: "Todos API",
          description: "Documentation of a simple Todos API",
          version: "0.0.1"
        },
        host: "localhost",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
          { name: "todo", description: "Todo related end-points" },
          { name: "tag", description: "Tag related end-points" }
        ]
      },
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
        tryItOutEnabled: false
      },
      exposeRoute: true
    });

    // Setup routes
    setupRoutes(this.fastifyInstance);

    // Start server
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
