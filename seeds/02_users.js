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

  // Insert users
  const users = [
    // Admin
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Admin Sistema',
      email: 'admin@academic.com',
      role: 'admin',
      course_id: null
    },
    
    // Coordinators
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      name: 'Dr. João Silva',
      email: 'joao.silva@academic.com',
      role: 'coordinator',
      course_id: ccCourse.id
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      name: 'Dra. Maria Santos',
      email: 'maria.santos@academic.com',
      role: 'coordinator',
      course_id: siCourse.id
    },
    
    // Teachers
    {
      id: '550e8400-e29b-41d4-a716-446655440020',
      name: 'Prof. Carlos Oliveira',
      email: 'carlos.oliveira@academic.com',
      role: 'teacher',
      course_id: ccCourse.id
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440021',
      name: 'Profa. Ana Costa',
      email: 'ana.costa@academic.com',
      role: 'teacher',
      course_id: siCourse.id
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440022',
      name: 'Prof. Pedro Rodrigues',
      email: 'pedro.rodrigues@academic.com',
      role: 'teacher',
      course_id: adsCourse.id
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440023',
      name: 'Profa. Lucia Ferreira',
      email: 'lucia.ferreira@academic.com',
      role: 'teacher',
      course_id: ccCourse.id
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440024',
      name: 'Prof. Roberto Lima',
      email: 'roberto.lima@academic.com',
      role: 'teacher',
      course_id: siCourse.id
    }
  ];

  // Students - 20 students distributed among courses
  const students = [];
  const studentNames = [
    'Alice Souza', 'Bruno Mendes', 'Carla Dias', 'Diego Pereira', 'Eduarda Gomes',
    'Felipe Alves', 'Gabriela Ribeiro', 'Hugo Martins', 'Isabela Moura', 'João Cardoso',
    'Karen Barbosa', 'Lucas Teixeira', 'Mariana Castro', 'Nicolas Araujo', 'Olivia Nunes',
    'Paulo Freitas', 'Quintino Ramos', 'Renata Vieira', 'Samuel Correia', 'Tatiana Lopes'
  ];

  studentNames.forEach((name, index) => {
    const courseId = index < 7 ? ccCourse.id : (index < 14 ? siCourse.id : adsCourse.id);
    students.push({
      id: `550e8400-e29b-41d4-a716-44665544${(100 + index).toString().padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@student.academic.com`,
      role: 'student',
      course_id: courseId
    });
  });

  await knex('users').insert([...users, ...students]);
};
