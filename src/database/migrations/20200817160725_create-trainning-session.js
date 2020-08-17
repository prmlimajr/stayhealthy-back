exports.up = function (knex) {
  return knex.schema.createTable('trainnning_session', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table.string('exercise').notNullable();
    table.integer('series').notNullable();
    table.integer('repetitions').notNullable();
    table.string('load').notNullable();
    table.string('kind').notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {};
