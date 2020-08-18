exports.up = function (knex) {
  return knex.schema.createTable('trainning_type', (table) => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.string('description').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('trainning_type');
};
