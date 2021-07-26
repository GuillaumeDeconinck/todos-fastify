import { inject, singleton } from "tsyringe";
import { Todo } from "../../domain/models/Todo";
import { TodosRepository } from "../../domain/repositories/todos.repository";

@singleton()
export class TodosAppService {
  constructor(@inject("TodosRepository") private todosRepository: TodosRepository) {}

  async listTodos(ownerUuid: string): Promise<Todo[]> {
    return await this.todosRepository.listTodos(ownerUuid);
  }

  async getTodo(ownerUuid: string, todoUuid: string): Promise<Todo> {
    return await this.todosRepository.getTodo(ownerUuid, todoUuid);
  }
}
