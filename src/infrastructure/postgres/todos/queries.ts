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
  `
};
