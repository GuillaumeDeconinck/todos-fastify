import { FastifyInstance } from "fastify";
import { setupTodosRoutes } from "./todos/todosRoutes";

export const setupRoutes = (fastifyInstance: FastifyInstance): void => {
  setupTodosRoutes(fastifyInstance);
};
