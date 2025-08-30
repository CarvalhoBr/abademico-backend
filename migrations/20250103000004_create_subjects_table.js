/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('subjects', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('code').notNullable();
    table.integer('credits').notNullable();
    table.uuid('semester_id').notNullable();
    table.uuid('teacher_id').nullable();
    table.timestamps(true, true);
    
    // Foreign key constraints
    table.foreign('semester_id').references('id').inTable('semesters').onDelete('CASCADE');
    table.foreign('teacher_id').references('id').inTable('users').onDelete('SET NULL');
    
    // Unique constraint
    table.unique(['code', 'semester_id']);
    
    // Indexes
    table.index(['semester_id']);
    table.index(['teacher_id']);
    table.index(['credits']);
    
    // Check constraint for positive credits
    table.check('credits > 0');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('subjects');
};
