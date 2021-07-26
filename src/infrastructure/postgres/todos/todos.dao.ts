import { registry, singleton } from "tsyringe";
import { Todo } from "../../../domain/models/Todo";
import { TodosRepository } from "../../../domain/repositories/todos.repository";

// As interfaces do not exist in JS
// We need to use a string as the token to specify the wanted implem
@registry([{ token: "TodosRepository", useClass: TodosDaoService }])
@singleton()
export class TodosDaoService implements TodosRepository {
  async listTodos(ownerUuid: string): Promise<Todo[]> {
    return [];
  }
  async getTodo(ownerUuid: string, todoUuid: string): Promise<Todo> {
    return undefined;
  }
}
