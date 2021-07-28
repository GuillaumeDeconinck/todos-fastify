import { FastifySchema } from "fastify";
import { TodoState } from "../../../domain/models/Todo";

const listTodosDocSchema: FastifySchema = {
  summary: "List all the todos",
  tags: ["todo"],
  description: "List all the todos of the user provided in the query parameters",
  querystring: {
    ownerUuid: {
      name: "ownerUuid",
      in: "query"
    }
  },
  response: {
    "200": {
      description: "Successful response",
      type: "array",
      items: {
        type: "object",
        properties: {
          test: {
            type: "string"
          }
        }
      },
      example: [
        {
          uuid: "3d780d09-c520-4817-b430-ce849bcc5423",
          ownerUuid: "535d6711-2ec0-4ba7-9f34-3d13f25de822",
          title: "Groceries",
          state: TodoState.ACTIVE
        }
      ]
    }
  }
};

const getTodoSchema: FastifySchema = {
  summary: "Get a specific todo",
  tags: ["todo"],
  description: "Get a specific todo by providing its uuid",
  params: {
    todoUuid: {
      type: "string"
    }
  },
  querystring: {
    ownerUuid: {
      name: "ownerUuid",
      in: "query"
    }
  },
  response: {
    "200": {
      description: "Successful response",
      type: "object",
      properties: {
        uuid: {
          type: "string"
        },
        ownerUuid: {
          type: "string"
        },
        title: {
          type: "string"
        },
        state: {
          type: "string"
        }
      },
      example: {
        uuid: "3d780d09-c520-4817-b430-ce849bcc5423",
        ownerUuid: "535d6711-2ec0-4ba7-9f34-3d13f25de822",
        title: "Groceries",
        state: TodoState.ACTIVE
      }
    }
  }
};

export const todosRoutesSchemas = { listTodosDocSchema, getTodoSchema };
