import { Column, Entity, PrimaryColumn } from "typeorm";
import { Tag } from "./Tag";

export enum TodoState {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DELETED = "DELETED"
}

@Entity()
export class Todo {
  @PrimaryColumn({
    type: "uuid"
  })
  uuid: string;

  @Column("uuid")
  ownerUuid: string;

  @Column({
    type: "varchar",
    length: 20
  })
  state: TodoState;

  @Column({
    type: "varchar",
    length: 255
  })
  title: string;

  @Column({
    type: "text",
    nullable: true
  })
  description?: string;

  tags?: Tag[];
}
