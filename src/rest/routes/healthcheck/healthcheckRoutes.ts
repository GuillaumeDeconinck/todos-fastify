import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { Maintenance } from "../../../tools/maintenance";

@singleton()
export class HealthcheckRoutes {
  constructor(@inject(Maintenance) private maintenance: Maintenance) {
    // `this` scope is lost when methods are called by Fastify
    this.isReady = this.isReady.bind(this);
    this.isHealthy = this.isHealthy.bind(this);
  }

  isReady = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (this.maintenance.getIsReady()) {
      reply.status(200).send();
    } else {
      reply.status(503).send();
    }
  };

  isHealthy = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (this.maintenance.getIsHealthy()) {
      reply.status(200).send();
    } else {
      reply.status(503).send();
    }
  };
}
