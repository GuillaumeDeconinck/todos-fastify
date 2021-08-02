import { Todo } from "../models/Todo";

export interface TodosRepository {
  listTodos(ownerUuid: string): Promise<Todo[]>;

  getTodo(todoUuid: string, ownerUuid: string): Promise<Todo>;

  createTodo(todo: Todo): Promise<Todo>;

  updateTodo(todo: Todo): Promise<Todo>;

  deleteTodo(todoUuid: string, ownerUuid: string): Promise<void>;
}
