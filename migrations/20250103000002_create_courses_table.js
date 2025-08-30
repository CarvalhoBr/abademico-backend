/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('courses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('code').notNullable().unique();
    table.text('description').nullable();
    table.uuid('coordinator_id').nullable();
    table.timestamps(true, true);
    
    // Foreign key constraint
    table.foreign('coordinator_id').references('id').inTable('users').onDelete('SET NULL');
    
    // Indexes
    table.index(['code']);
    table.index(['coordinator_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('courses');
};
