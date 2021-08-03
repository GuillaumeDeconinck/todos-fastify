import { container } from "tsyringe";
import { TodosAppService } from "../../../../src/application/services/todosAppService";
import { TodoState } from "../../../../src/domain/models/Todo";

describe("Testing Todos dao", () => {
  let mockGet: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let mockedTodoRepo: { [key: string]: jest.Mock };

  beforeAll(() => {
    mockGet = jest.fn().mockResolvedValue({ uuid: "uuid1" });
    mockUpdate = jest.fn().mockResolvedValue(true);
    mockDelete = jest.fn().mockResolvedValue(true);
    mockedTodoRepo = { getTodo: mockGet, updateTodo: mockUpdate, deleteTodo: mockDelete };

    container.registerInstance("TodosRepository", mockedTodoRepo);
  });

  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockDelete.mockClear();
  });

  it("should call the delete dao function when the hard delete flag is at `true`", async () => {
    const todosAppService = container.resolve(TodosAppService);

    await todosAppService.deleteTodo("uuid1", "uuid2", true);

    expect(mockGet).toHaveBeenCalledTimes(0);
    expect(mockUpdate).toHaveBeenCalledTimes(0);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it("should soft delete when the hard delete flag is not present", async () => {
    const todosAppService = container.resolve(TodosAppService);

    await todosAppService.deleteTodo("uuid1", "uuid2");

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({ uuid: "uuid1", state: TodoState.DELETED });
    expect(mockDelete).toHaveBeenCalledTimes(0);
  });

  it("should soft delete when the hard delete flag is false", async () => {
    const todosAppService = container.resolve(TodosAppService);

    await todosAppService.deleteTodo("uuid1", "uuid2");

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({ uuid: "uuid1", state: TodoState.DELETED });
    expect(mockDelete).toHaveBeenCalledTimes(0);
  });

  afterAll(() => {
    container.clearInstances();
    jest.clearAllMocks();
  });
});
