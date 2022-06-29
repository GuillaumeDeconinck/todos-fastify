import { QueryRunner, Table, TableIndex } from "typeorm";

export class TagsTableAndLinks20210726123222 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tags table
    await queryRunner.createTable(
      new Table({
        name: "tags",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isNullable: false,
            isPrimary: true
          },
          {
            name: "owner_uuid",
            type: "uuid",
            isNullable: false
          },
          {
            name: "state",
            type: "varchar",
            length: "20",
            isNullable: false
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false
          }
        ]
      })
    );

    // Index on `owner_uuid` and `state`
    await queryRunner.createIndex(
      "tags",
      new TableIndex({ name: "tags__owner_uuid__state", columnNames: ["owner_uuid", "state"] })
    );

    // Todos table
    await queryRunner.createTable(
      new Table({
        name: "todos_tags",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isNullable: false,
            isPrimary: true
          },
          {
            name: "todo_uuid",
            type: "uuid",
            isNullable: false
          },
          {
            name: "tag_uuid",
            type: "uuid",
            isNullable: false
          }
        ]
      })
    );

    // Index on `todo_uuid`
    await queryRunner.createIndex(
      "todos_tags",
      new TableIndex({ name: "todos_tags__todo_uuid", columnNames: ["todo_uuid"] })
    );
    // Index on `tag_uuid`
    await queryRunner.createIndex(
      "todos_tags",
      new TableIndex({ name: "todos_tags__tag_uuid", columnNames: ["tag_uuid"] })
    );
  }
}
