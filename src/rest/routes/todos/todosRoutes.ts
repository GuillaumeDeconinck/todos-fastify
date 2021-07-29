import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { TodosAppService } from "../../../application/services/todosAppService";

@singleton()
export class TodosRoutes {
  constructor(@inject(TodosAppService) private todosAppService: TodosAppService) {
    // `this` scope is lost when methods are called by Fastify
    this.listTodos = this.listTodos.bind(this);
    this.getTodo = this.getTodo.bind(this);
  }

  async listTodos(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todos = await this.todosAppService.listTodos(ownerUuid);
    reply.status(200).send(todos);
  }

  async getTodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todoUuid = request.params["todoUuid"];

    try {
      const todo = await this.todosAppService.getTodo(ownerUuid, todoUuid);
      reply.status(200).send(todo);
    } catch (error) {
      console.log(error);
      if (error.message === "Todo not found") {
        reply.status(404).send();
      } else {
        reply.status(500).send(error);
      }
    }
  }
}
