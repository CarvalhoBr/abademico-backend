/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('enrollments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('student_id').notNullable();
    table.uuid('subject_id').notNullable();
    table.timestamp('enrollment_date').defaultTo(knex.fn.now());
    table.enum('status', ['active', 'completed', 'dropped']).defaultTo('active');
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('student_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('subject_id').references('id').inTable('subjects').onDelete('CASCADE');
    
    // Unique constraint
    table.unique(['student_id', 'subject_id']);
    
    // Indexes
    table.index(['student_id']);
    table.index(['subject_id']);
    table.index(['status']);
    table.index(['enrollment_date']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('enrollments');
};
