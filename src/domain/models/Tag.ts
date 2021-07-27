export enum TagState {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED"
}

export interface Tag {
  uuid: string;

  ownerUuid: string;

  state: TagState;

  name: string;
}
