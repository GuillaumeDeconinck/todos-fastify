import { delay, inject, injectable, registry, singleton } from "tsyringe";
import { PostgresPool } from "..";
import { ApplicationError, ApplicationErrorType } from "../../../application/errors/ApplicationError";
import { Todo } from "../../../domain/models/Todo";
import { TodosRepository } from "../../../domain/repositories/todos.repository";
import { todosQueries } from "./queries";

// As interfaces do not exist in JS
// We need to use a string as the token to specify the wanted implem
@registry([{ token: "TodosRepository", useClass: TodosDaoService }])
@singleton()
@injectable()
export class TodosDaoService implements TodosRepository {
  constructor(@inject(delay(() => PostgresPool)) private pool: PostgresPool) {}

  async listTodos(ownerUuid: string): Promise<Todo[]> {
    return await this.pool.executeQuery<Todo>("listTodos", todosQueries.listTodos, [ownerUuid]);
  }

  async getTodo(todoUuid: string, ownerUuid: string): Promise<Todo> {
    const result = await this.pool.executeQuery<Todo>("getTodo", todosQueries.getTodo, [todoUuid, ownerUuid]);

    if (result.length === 0) {
      throw new ApplicationError("Todo not found", ApplicationErrorType.NOT_FOUND);
    }

    // Technically, in production it could be preferable to be warned with a log, while still answering the request correctly
    if (result.length > 1) {
      throw new ApplicationError("Found more than 1 todos", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }

    return result[0];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    // Check for Heroku, a real prod app won't have this (or would have a "per account" check)
    const totalCountResult = await this.pool.executeQuery<{ totalCount: number }>(
      "countTotalTodosCrossOwner",
      todosQueries.countTotalTodosCrossOwner,
      []
    );
    if (totalCountResult.length === 0) {
      throw new ApplicationError(
        "Error while retrieving the total count of todos",
        ApplicationErrorType.INTERNAL_SERVER_ERROR
      );
    }
    const totalCount = totalCountResult[0].totalCount;
    if (totalCount >= 1000) {
      throw new ApplicationError("Error, DB already full of todos", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }

    // Actual query for adding a todo
    const params = [todo.uuid, todo.ownerUuid, todo.state, todo.title, todo.description];
    const result = await this.pool.executeQuery<Todo>("createTodo", todosQueries.createTodo, params);

    if (result.length === 0) {
      throw new ApplicationError("Error while creating a new todo", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }
    // Technically, in production it could be preferable to be warned with a log, while still answering the request correctly
    if (result.length > 1) {
      throw new ApplicationError("Created more than 1 todos", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }

    return result[0];
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    const params = [todo.uuid, todo.ownerUuid, todo.state, todo.title, todo.description];

    const result = await this.pool.executeQuery<Todo>("updateTodo", todosQueries.updateTodo, params);

    if (result.length === 0) {
      throw new ApplicationError("Todo not found", ApplicationErrorType.NOT_FOUND);
    }

    // Technically, in production it could be preferable to be warned with a log, while still answering the request correctly
    if (result.length > 1) {
      throw new ApplicationError("Updated more than 1 todos", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }

    return result[0];
  }

  async deleteTodo(todoUuid: string, ownerUuid: string): Promise<void> {
    await this.pool.executeQuery<unknown>("deleteTodo", todosQueries.deleteTodo, [todoUuid, ownerUuid]);
  }
}
