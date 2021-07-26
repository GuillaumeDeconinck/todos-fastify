import got from "got";
import { API_URL } from "../../helpers/environment";

describe("Testing the todos API", () => {
  it("should return a 200 when listing todos", async () => {
    const response = await got<unknown[]>(`${API_URL}/v1/todos`, {
      method: "GET",
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
  });
});
