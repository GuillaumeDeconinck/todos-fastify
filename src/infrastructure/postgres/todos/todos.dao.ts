import { delay, inject, injectable, registry, singleton } from "tsyringe";
import { Repository } from "typeorm";
import { PostgresPool } from "..";
import { ApplicationError, ApplicationErrorType } from "../../../application/errors/ApplicationError";
import { Todo } from "../../../domain/models/Todo";
import { TodosRepository } from "../../../domain/repositories/todos.repository";

// As interfaces do not exist in JS
// We need to use a string as the token to specify the wanted implem
@registry([{ token: "TodosRepository", useClass: TodosDaoService }])
@singleton()
@injectable()
export class TodosDaoService implements TodosRepository {
  private repository: Repository<Todo>;

  constructor(@inject(delay(() => PostgresPool)) private pool: PostgresPool) {
    this.repository = pool.getRepository<Todo>(Todo);
  }

  async listTodos(ownerUuid: string): Promise<Todo[]> {
    return await this.repository.find({ ownerUuid });
  }

  async getTodo(todoUuid: string, ownerUuid: string): Promise<Todo> {
    const result = await this.repository.findOne({ uuid: todoUuid, ownerUuid });

    if (!result) {
      throw new ApplicationError("Todo not found", ApplicationErrorType.NOT_FOUND);
    }

    return result;
  }

  async createTodo(todo: Todo): Promise<Todo> {
    // Check for Heroku, a real prod app won't have this (or would have a "per account" check)
    const totalCount = await this.repository.count();
    if (totalCount >= 1000) {
      throw new ApplicationError("Error, DB already full of todos", ApplicationErrorType.INTERNAL_SERVER_ERROR);
    }

    return await this.repository.save(todo);
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    return await this.repository.save(todo);
  }

  async deleteTodo(todoUuid: string, ownerUuid: string): Promise<void> {
    await this.repository.delete({ uuid: todoUuid, ownerUuid });
  }
}
