export const todosQueries = {
  listTodos: `
    SELECT
      uuid,
      owner_uuid as "ownerUuid",
      state,
      title,
      description
    FROM todos
    WHERE owner_uuid = $1;
  `,
  getTodo: `
    SELECT
      uuid,
      owner_uuid as "ownerUuid",
      state,
      title,
      description
    FROM todos
    WHERE uuid = $1 AND owner_uuid = $2;
  `,
  createTodo: `
    INSERT INTO todos
      (uuid, owner_uuid, state, title, description)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING
      uuid,
      owner_uuid as "ownerUuid",
      state,
      title,
      description;
  `,
  updateTodo: `
    UPDATE todos
    SET state = $3, title = $4, description = $5
    WHERE uuid = $1 AND owner_uuid = $2
    RETURNING
      uuid,
      owner_uuid as "ownerUuid",
      state,
      title,
      description;;
  `,
  deleteTodo: `
    DELETE FROM todos
    WHERE uuid = $1 AND owner_uuid = $2;
  `
};
