/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('semesters', function(table) {
    // Remove foreign key constraint first
    table.dropForeign(['course_id']);
    
    // Drop the unique constraint that includes course_id
    table.dropUnique(['code', 'course_id']);
    
    // Remove the course_id column
    table.dropColumn('course_id');
    
    // Make code unique by itself since semesters are now global
    table.unique(['code']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('semesters', function(table) {
    // Drop the unique constraint on code
    table.dropUnique(['code']);
    
    // Add back the course_id column
    table.uuid('course_id').notNullable();
    
    // Add back the foreign key constraint
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    
    // Add back the unique constraint
    table.unique(['code', 'course_id']);
    
    // Add back the index
    table.index(['course_id']);
  });
};
