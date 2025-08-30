/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Semesters are now global - not tied to specific courses
  const semesters = [
    {
      id: '550e8400-e29b-41d4-a716-446655440050',
      code: '2025-01',
      start_date: '2025-02-03',
      end_date: '2025-06-28'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440051',
      code: '2025-02',
      start_date: '2025-08-04',
      end_date: '2025-12-20'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440052',
      code: '2026-01',
      start_date: '2026-02-02',
      end_date: '2026-06-26'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440053',
      code: '2026-02',
      start_date: '2026-08-03',
      end_date: '2026-12-18'
    }
  ];

  await knex('semesters').insert(semesters);
};
