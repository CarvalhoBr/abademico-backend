/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.enum('role', ['student', 'teacher', 'coordinator', 'admin']).notNullable();
    table.uuid('course_id').nullable();
    table.timestamps(true, true);
    
    // Foreign key constraint
    table.foreign('course_id').references('id').inTable('courses').onDelete('SET NULL');
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['course_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
