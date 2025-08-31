/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('enrollments').del();
  await knex('subjects').del();
  await knex('semesters').del();
  await knex('user_courses').del();
  await knex('users').del();
  await knex('courses').del();

  // Insert courses
  const courses = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Ciência da Computação',
      code: 'CC',
      description: 'Curso de Bacharelado em Ciência da Computação'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Sistemas de Informação',
      code: 'SI',
      description: 'Curso de Bacharelado em Sistemas de Informação'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Análise e Desenvolvimento de Sistemas',
      code: 'ADS',
      description: 'Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas'
    }
  ];

  await knex('courses').insert(courses);
};
