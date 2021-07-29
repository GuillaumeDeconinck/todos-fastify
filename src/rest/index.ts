import fastify, { FastifyInstance } from "fastify";
import fastifyCors, { FastifyCorsOptions } from "fastify-cors";
import fastifyOpenApiGlue, { FastifyOpenapiGlueOptions } from "fastify-openapi-glue";
import fastifyStatic from "fastify-static";
import fastifySwagger from "fastify-swagger";
import path from "path";
import { container, inject, singleton } from "tsyringe";
import { AppConfiguration } from "../tools/config";
import { Logger } from "../tools/logger";
import { TodosRoutes } from "./routes/todos/todosRoutes";

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

    // Swagger / OpenAPI
    this.fastifyInstance.register(fastifySwagger, {
      routePrefix: "/docs",
      mode: "static",
      specification: {
        path: "openapi.yaml",
        baseDir: process.cwd()
      },
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
        tryItOutEnabled: false
      },
      exposeRoute: true
    });

    const openapiGlueOptions: FastifyOpenapiGlueOptions = {
      specification: "openapi.yaml",
      service: container.resolve(TodosRoutes),
      noAdditional: false
    };
    this.fastifyInstance.register(fastifyOpenApiGlue, openapiGlueOptions);

    // Base html file for root path (just to avoid a ugly 404)
    this.fastifyInstance.register(fastifyStatic, {
      root: path.join(process.cwd(), "static")
    });

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
