"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  // Todos table
  await db.createTable("tags", {
    uuid: {
      type: "uuid",
      notNull: true,
      primaryKey: true
    },
    owner_uuid: {
      type: "uuid",
      notNull: true
    },
    state: {
      type: "string",
      length: 20,
      notNull: true
    },
    name: {
      type: "string",
      length: 255,
      notNull: true
    }
  });

  // Index on `owner_uuid` and `state`
  await db.addIndex("tags", "tags__owner_uuid__state", ["owner_uuid", "state"]);

  // Todos table
  await db.createTable("todos_tags", {
    uuid: {
      type: "uuid",
      notNull: true,
      primaryKey: true
    },
    todo_uuid: {
      type: "uuid",
      notNull: true
    },
    tag_uuid: {
      type: "uuid",
      notNull: true
    }
  });

  // Index on `todo_uuid`
  await db.addIndex("todos_tags", "todos_tags__todo_uuid", ["todo_uuid"]);
  // Index on `tag_uuid`
  await db.addIndex("todos_tags", "todos_tags__tag_uuid", ["tag_uuid"]);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1
};
