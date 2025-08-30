/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('semesters', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('code').notNullable().comment('Format: YYYY-SS (e.g., 2025-01)');
    table.uuid('course_id').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.timestamps(true, true);
    
    // Foreign key constraint
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    
    // Unique constraint
    table.unique(['code', 'course_id']);
    
    // Indexes
    table.index(['course_id']);
    table.index(['start_date']);
    table.index(['end_date']);
    
    // Check constraint for date validation
    table.check('start_date < end_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('semesters');
};
