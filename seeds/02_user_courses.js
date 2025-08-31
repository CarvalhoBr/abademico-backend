/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get course IDs
  const courses = await knex('courses').select('id', 'code');
  const ccCourse = courses.find(c => c.code === 'CC');
  const siCourse = courses.find(c => c.code === 'SI');
  const adsCourse = courses.find(c => c.code === 'ADS');

  // Insert user-course relationships
  const userCourses = [
    // Coordinators
    {
      user_id: '550e8400-e29b-41d4-a716-446655440011', // Dr. João Silva
      course_id: ccCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440012', // Dra. Maria Santos
      course_id: siCourse.id
    },
    
    // Teachers - Some teachers teach in multiple courses
    {
      user_id: '550e8400-e29b-41d4-a716-446655440020', // Prof. Carlos Oliveira
      course_id: ccCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440020', // Prof. Carlos Oliveira (also teaches in SI)
      course_id: siCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440021', // Profa. Ana Costa
      course_id: siCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440021', // Profa. Ana Costa (also teaches in ADS)
      course_id: adsCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440022', // Prof. Pedro Rodrigues
      course_id: adsCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440023', // Profa. Lucia Ferreira
      course_id: ccCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440024', // Prof. Roberto Lima
      course_id: siCourse.id
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440024', // Prof. Roberto Lima (also teaches in ADS)
      course_id: adsCourse.id
    }
  ];

  // Students - Some students are enrolled in multiple courses
  const studentIds = [
    '550e8400-e29b-41d4-a716-446655440100', // Alice Souza
    '550e8400-e29b-41d4-a716-446655440101', // Bruno Mendes
    '550e8400-e29b-41d4-a716-446655440102', // Carla Dias
    '550e8400-e29b-41d4-a716-446655440103', // Diego Pereira
    '550e8400-e29b-41d4-a716-446655440104', // Eduarda Gomes
    '550e8400-e29b-41d4-a716-446655440105', // Felipe Alves
    '550e8400-e29b-41d4-a716-446655440106', // Gabriela Ribeiro
    '550e8400-e29b-41d4-a716-446655440107', // Hugo Martins
    '550e8400-e29b-41d4-a716-446655440108', // Isabela Moura
    '550e8400-e29b-41d4-a716-446655440109', // João Cardoso
    '550e8400-e29b-41d4-a716-446655440110', // Karen Barbosa
    '550e8400-e29b-41d4-a716-446655440111', // Lucas Teixeira
    '550e8400-e29b-41d4-a716-446655440112', // Mariana Castro
    '550e8400-e29b-41d4-a716-446655440113', // Nicolas Araujo
    '550e8400-e29b-41d4-a716-446655440114', // Olivia Nunes
    '550e8400-e29b-41d4-a716-446655440115', // Paulo Freitas
    '550e8400-e29b-41d4-a716-446655440116', // Quintino Ramos
    '550e8400-e29b-41d4-a716-446655440117', // Renata Vieira
    '550e8400-e29b-41d4-a716-446655440118', // Samuel Correia
    '550e8400-e29b-41d4-a716-446655440119'  // Tatiana Lopes
  ];

  // Distribute students among courses (some in multiple courses)
  studentIds.forEach((studentId, index) => {
    if (index < 7) {
      // First 7 students in CC
      userCourses.push({
        user_id: studentId,
        course_id: ccCourse.id
      });
    } else if (index < 14) {
      // Next 7 students in SI
      userCourses.push({
        user_id: studentId,
        course_id: siCourse.id
      });
    } else {
      // Last 6 students in ADS
      userCourses.push({
        user_id: studentId,
        course_id: adsCourse.id
      });
    }

    // Some students are enrolled in multiple courses (cross-enrollment)
    if (index === 0) { // Alice Souza - CC + SI
      userCourses.push({
        user_id: studentId,
        course_id: siCourse.id
      });
    } else if (index === 7) { // Gabriela Ribeiro - SI + ADS
      userCourses.push({
        user_id: studentId,
        course_id: adsCourse.id
      });
    } else if (index === 14) { // Paulo Freitas - ADS + CC
      userCourses.push({
        user_id: studentId,
        course_id: ccCourse.id
      });
    }
  });

  await knex('user_courses').insert(userCourses);
};
