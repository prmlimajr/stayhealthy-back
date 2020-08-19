exports.up = function (knex) {
  return knex.schema.createTable('trainning_session', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table
      .integer('trainning_type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('trainning_type');
    table.string('exercise').notNullable();
    table.integer('series');
    table.integer('repetitions');
    table.string('load');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('trainning_session');
};
