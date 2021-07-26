import { Tag } from "./Tag";

export enum TodoState {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DELETED = "DELETED"
}

export interface Todo {
  uuid: string;

  ownerUuid: string;

  state: TodoState;

  title: string;

  description?: string;

  tags?: Tag[];
}
