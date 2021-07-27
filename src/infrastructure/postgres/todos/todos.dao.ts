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

  async getTodo(ownerUuid: string, todoUuid: string): Promise<Todo> {
    const result = await this.pool.executeQuery<Todo>("getTodo", todosQueries.getTodo, [todoUuid, ownerUuid]);

    if (result.length === 0) {
      throw new Error("Todo not found");
    }

    if (result.length > 1) {
      throw new Error("Found more than 1 todos");
    }

    return result[0];
  }
}
