import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container, inject, singleton } from "tsyringe";
import { TodosAppService } from "../../../application/services/todosAppService";

@singleton()
class TodosRoutes {
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
    const todo = await this.todosAppService.getTodo(ownerUuid, todoUuid);
    reply.status(200).send(todo);
  }
}

export const setupTodosRoutes = (fastifyInstance: FastifyInstance): void => {
  const todosRoutes = container.resolve(TodosRoutes);

  fastifyInstance.route({
    method: "GET",
    url: "/v1/todos",
    handler: todosRoutes.listTodos
  });
  fastifyInstance.route({
    method: "GET",
    url: "/v1/todos/:todoUuid",
    handler: todosRoutes.listTodos
  });
};
