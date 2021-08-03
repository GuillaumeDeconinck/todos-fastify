import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { TodosAppService } from "../../../application/services/todosAppService";
import { Todo } from "../../../domain/models/Todo";

@singleton()
export class TodosRoutes {
  constructor(@inject(TodosAppService) private todosAppService: TodosAppService) {
    // `this` scope is lost when methods are called by Fastify
    this.listTodos = this.listTodos.bind(this);
    this.getTodo = this.getTodo.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  async listTodos(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todos = await this.todosAppService.listTodos(ownerUuid);
    reply.status(200).send(todos);
  }

  async getTodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    try {
      const todo = await this.todosAppService.getTodo(todoUuid, ownerUuid);
      reply.status(200).send(todo);
    } catch (error) {
      if (error.message === "Todo not found") {
        reply.status(404).send();
      } else {
        reply.status(500).send(error);
      }
    }
  }

  async createTodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const todoToCreate = request.body as Todo;
    try {
      const todo = await this.todosAppService.createTodo(todoToCreate);
      reply.status(200).send(todo);
    } catch (error) {
      reply.status(500).send(error);
    }
  }

  async updateTodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    const todoToCreate = request.body as Todo;
    try {
      const todo = await this.todosAppService.updateTodo(todoUuid, ownerUuid, todoToCreate);
      reply.status(200).send(todo);
    } catch (error) {
      if (error.message === "Todo not found") {
        reply.status(404).send();
      } else {
        reply.status(500).send(error);
      }
    }
  }

  async deleteTodo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const todoUuid = request.params["todoUuid"];

    // Will come from the JWT
    const ownerUuid = request.query["ownerUuid"];

    // Hard delete flag
    const hardDelete = request.query["hard"] === "true" || request.query["hard"] === true;

    try {
      await this.todosAppService.deleteTodo(todoUuid, ownerUuid, hardDelete);
      reply.status(204).send();
    } catch (error) {
      if (error.message === "Todo not found") {
        reply.status(404).send();
      } else {
        reply.status(500).send(error);
      }
    }
  }
}
