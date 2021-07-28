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

  it("should return a 404 when retrieving a single -missing- todo, as it doesn't exist", async () => {
    const response = await got<Todo[]>(`${API_URL}/v1/todos/3d780d09-c520-4817-b430-ce849bcc5423`, {
      method: "GET",
      searchParams: {
        ownerUuid: "535d6711-2ec0-4ba7-9f34-3d13f25de822"
      },
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(404);
  });
});
