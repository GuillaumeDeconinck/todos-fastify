import { delay, inject, injectable, registry, singleton } from "tsyringe";
import { PostgresPool } from "..";
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
      throw new Error("Todo not found");
    }

    if (result.length > 1) {
      throw new Error("Found more than 1 todos");
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
      throw new Error("Error while retrieving the total count of todos");
    }
    const totalCount = totalCountResult[0].totalCount;
    if (totalCount >= 1000) {
      throw new Error("Error, DB already full of todos");
    }

    // Actual query for adding a todo
    const params = [todo.uuid, todo.ownerUuid, todo.state, todo.title, todo.description];
    const result = await this.pool.executeQuery<Todo>("createTodo", todosQueries.createTodo, params);

    if (result.length === 0) {
      throw new Error("Error while creating a new todo");
    }
    if (result.length > 1) {
      throw new Error("Created more than 1 todos");
    }

    return result[0];
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    const params = [todo.uuid, todo.ownerUuid, todo.state, todo.title, todo.description];

    const result = await this.pool.executeQuery<Todo>("updateTodo", todosQueries.updateTodo, params);

    if (result.length === 0) {
      throw new Error("Todo not found");
    }

    if (result.length > 1) {
      throw new Error("Updated more than 1 todos");
    }

    return result[0];
  }

  async deleteTodo(todoUuid: string, ownerUuid: string): Promise<void> {
    await this.pool.executeQuery<unknown>("deleteTodo", todosQueries.deleteTodo, [todoUuid, ownerUuid]);
  }
}
