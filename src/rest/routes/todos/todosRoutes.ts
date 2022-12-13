import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { TodosAppService } from "../../../application/services/todosAppService";
import { Todo } from "../../../domain/models/Todo";
import { Logger } from "../../../tools/logger";

@singleton()
export class TodosRoutes {
  constructor(
    @inject(TodosAppService) private todosAppService: TodosAppService,
    @inject(Logger) private logger: Logger
  ) {}

  listTodos = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    this.logger.logger.info("Test");

    const todos = await this.todosAppService.listTodos(ownerUuid);
    reply.status(200).send(todos);
  };

  getTodo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todo = await this.todosAppService.getTodo(todoUuid, ownerUuid);
    reply.status(200).send(todo);
  };

  createTodo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const todoToCreate = request.body as Todo;
    const todo = await this.todosAppService.createTodo(todoToCreate);
    reply.status(200).send(todo);
  };

  updateTodo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todoToCreate = request.body as Todo;
    const todo = await this.todosAppService.updateTodo(todoUuid, ownerUuid, todoToCreate);
    reply.status(200).send(todo);
  };

  deleteTodo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    // Hard delete flag
    const hardDelete = request.query["hard"] === "true" || request.query["hard"] === true;

    await this.todosAppService.deleteTodo(todoUuid, ownerUuid, hardDelete);
    reply.status(204).send();
  };
}
