import { Todo } from "../models/Todo";

export interface TodosRepository {
  listTodos(ownerUuid: string): Promise<Todo[]>;

  getTodo(ownerUuid: string, todoUuid: string): Promise<Todo>;
}
