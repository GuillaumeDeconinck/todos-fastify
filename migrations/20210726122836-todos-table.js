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
  await db.createTable("todos", {
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
    title: {
      type: "string",
      length: 255,
      notNull: true
    },
    description: {
      type: "string",
      notNull: false
    }
  });

  // Index on `owner_uuid` and `state`
  await db.addIndex("todos", "todos__owner_uuid__state", ["owner_uuid", "state"]);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1
};
