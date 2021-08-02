import got from "got";
import { API_URL } from "../../helpers/environment";

describe("Testing the healthcheck API", () => {
  it("should return a 200 when checking the readiness", async () => {
    const response = await got<void>(`${API_URL}/ready`, {
      method: "GET",
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
  });

  it("should return a 200 when checking the healthiness", async () => {
    const response = await got<void>(`${API_URL}/healthy`, {
      method: "GET",
      responseType: "json",
      retry: 0,
      throwHttpErrors: false
    });

    expect(response.statusCode).toBe(200);
  });
});
