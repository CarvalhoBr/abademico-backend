/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_courses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.uuid('course_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    
    // Unique constraint to prevent duplicate relationships
    table.unique(['user_id', 'course_id']);
    
    // Indexes
    table.index(['user_id']);
    table.index(['course_id']);
    table.index(['user_id', 'course_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_courses');
};
