import got from "got";
import { Todo, TodoState } from "../../../../src/domain/models/Todo";
import { API_URL } from "../../helpers/environment";

const todoToCreate: Todo = {
  uuid: "3d780d09-c520-4817-b430-ce849bcc5423",
  ownerUuid: "535d6711-2ec0-4ba7-9f34-3d13f25de822",
  state: TodoState.ACTIVE,
  title: "Wash the dishes"
};

const todoToUpdate: Todo = {
  ...todoToCreate,
  title: "Wash the dirty dishes"
};

describe("Testing the todos API", () => {
  // Check initial state

  it("should return a 200 when listing todos", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return a 404 when retrieving a single -missing- todo, as it doesn't exist", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(404);
  });

  // Add a new todo

  it("should create a new todo ", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos`, {
      method: "POST",
      json: todoToCreate,
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(todoToCreate));
  });

  // Check new todo

  it("should retrieve the newly created todo", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(todoToCreate));
  });

  it("should return a 200 when listing todos, the newly created todo should be in the array", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toEqual(expect.objectContaining(todoToCreate));
  });

  // Update

  it("should update the todo", async () => {
    const response = await got<void>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "PUT",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      json: todoToUpdate,
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(todoToUpdate));
  });

  it("should retrieve the updated todo", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(todoToUpdate));
  });

  // Cleanup

  it("should delete the newly created todo ", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "DELETE",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 when retrieving a single todo, as it has been deleted now", async () => {
    const response = await got<Todo>(`${API_URL}/v1/todos/${todoToCreate.uuid}`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(404);
  });

  it("should return a 200 when listing todos", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos`, {
      method: "GET",
      searchParams: {
        ownerUuid: todoToCreate.ownerUuid
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
