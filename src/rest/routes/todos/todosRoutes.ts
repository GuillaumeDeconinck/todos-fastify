import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container, singleton } from "tsyringe";

@singleton()
class TodosRoutes {
  constructor() {
    this.listTodos = this.listTodos.bind(this);
  }

  listTodos(request: FastifyRequest, reply: FastifyReply): void {
    reply.status(200).send();
  }
}

export const setupTodosRoutes = (fastifyInstance: FastifyInstance): void => {
  const todosRoutes = container.resolve(TodosRoutes);

  fastifyInstance.route({
    method: "GET",
    url: "/v1/todos",
    handler: todosRoutes.listTodos
  });
};
