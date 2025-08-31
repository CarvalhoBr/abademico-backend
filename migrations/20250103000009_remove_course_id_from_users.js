/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    // Drop the foreign key constraint first
    table.dropForeign(['course_id']);
    // Drop the index
    table.dropIndex(['course_id']);
    // Drop the column
    table.dropColumn('course_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.uuid('course_id').nullable();
    table.foreign('course_id').references('id').inTable('courses').onDelete('SET NULL');
    table.index(['course_id']);
  });
};
