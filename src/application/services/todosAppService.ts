import { inject, singleton } from "tsyringe";
import { Todo } from "../../domain/models/Todo";
import { TodosRepository } from "../../domain/repositories/todos.repository";

@singleton()
export class TodosAppService {
  constructor(@inject("TodosRepository") private todosRepository: TodosRepository) {}

  async listTodos(ownerUuid: string): Promise<Todo[]> {
    return await this.todosRepository.listTodos(ownerUuid);
  }

  async getTodo(todoUuid: string, ownerUuid: string): Promise<Todo> {
    return await this.todosRepository.getTodo(todoUuid, ownerUuid);
  }

  async createTodo(todo: Todo): Promise<Todo> {
    return await this.todosRepository.createTodo(todo);
  }

  async updateTodo(todoUuid: string, ownerUuid: string, todo: Todo): Promise<Todo> {
    return await this.todosRepository.updateTodo(todo);
  }

  async deleteTodo(todoUuid: string, ownerUuid: string): Promise<void> {
    return await this.todosRepository.deleteTodo(todoUuid, ownerUuid);
  }
}
