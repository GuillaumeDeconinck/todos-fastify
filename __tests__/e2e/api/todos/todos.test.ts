import got from "got";
import { Todo } from "../../../../src/domain/models/Todo";
import { API_URL } from "../../helpers/environment";

describe("Testing the todos API", () => {
  it("should return a 200 when listing todos", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos`, {
      method: "GET",
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return a 200 when retrieving a single todo", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos/shouldBeAUuidAtSomePoint`, {
      method: "GET",
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
  });
});
