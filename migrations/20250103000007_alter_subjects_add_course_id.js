/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('subjects', function(table) {
    // Add course_id column
    table.uuid('course_id').notNullable();
    
    // Add foreign key constraint
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    
    // Add index for course_id
    table.index(['course_id']);
    
    // Drop the old unique constraint (code, semester_id)
    table.dropUnique(['code', 'semester_id']);
    
    // Add new unique constraint (code, course_id, semester_id)
    // This ensures a subject code is unique within a course and semester
    table.unique(['code', 'course_id', 'semester_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('subjects', function(table) {
    // Drop the new unique constraint
    table.dropUnique(['code', 'course_id', 'semester_id']);
    
    // Add back the old unique constraint
    table.unique(['code', 'semester_id']);
    
    // Remove foreign key constraint
    table.dropForeign(['course_id']);
    
    // Remove the course_id column
    table.dropColumn('course_id');
  });
};
