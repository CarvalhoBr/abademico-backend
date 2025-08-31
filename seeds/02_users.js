/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Insert users
  const users = [
    // Admin
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Admin Sistema',
      email: 'admin@academic.com',
      role: 'admin'
    },
    
    // Coordinators
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      name: 'Dr. João Silva',
      email: 'joao.silva@academic.com',
      role: 'coordinator'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      name: 'Dra. Maria Santos',
      email: 'maria.santos@academic.com',
      role: 'coordinator'
    },
    
    // Teachers
    {
      id: '550e8400-e29b-41d4-a716-446655440020',
      name: 'Prof. Carlos Oliveira',
      email: 'carlos.oliveira@academic.com',
      role: 'teacher'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440021',
      name: 'Profa. Ana Costa',
      email: 'ana.costa@academic.com',
      role: 'teacher'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440022',
      name: 'Prof. Pedro Rodrigues',
      email: 'pedro.rodrigues@academic.com',
      role: 'teacher'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440023',
      name: 'Profa. Lucia Ferreira',
      email: 'lucia.ferreira@academic.com',
      role: 'teacher'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440024',
      name: 'Prof. Roberto Lima',
      email: 'roberto.lima@academic.com',
      role: 'teacher'
    }
  ];

  // Students - 20 students
  const students = [];
  const studentNames = [
    'Alice Souza', 'Bruno Mendes', 'Carla Dias', 'Diego Pereira', 'Eduarda Gomes',
    'Felipe Alves', 'Gabriela Ribeiro', 'Hugo Martins', 'Isabela Moura', 'João Cardoso',
    'Karen Barbosa', 'Lucas Teixeira', 'Mariana Castro', 'Nicolas Araujo', 'Olivia Nunes',
    'Paulo Freitas', 'Quintino Ramos', 'Renata Vieira', 'Samuel Correia', 'Tatiana Lopes'
  ];

  studentNames.forEach((name, index) => {
    students.push({
      id: `550e8400-e29b-41d4-a716-44665544${(100 + index).toString().padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@student.academic.com`,
      role: 'student'
    });
  });

  await knex('users').insert([...users, ...students]);
};
