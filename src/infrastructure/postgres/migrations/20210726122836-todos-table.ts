import { QueryRunner, Table, TableIndex } from "typeorm";

export class TodosTable20210726122836 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Todos table
    await queryRunner.createTable(
      new Table({
        name: "todos",
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
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true
          }
        ]
      })
    );

    // Index on `owner_uuid` and `state`
    await queryRunner.createIndex(
      "todos",
      new TableIndex({ name: "todos__owner_uuid__state", columnNames: ["owner_uuid", "state"] })
    );
  }
}
