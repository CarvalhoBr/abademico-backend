/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get courses, semesters and teachers
  const courses = await knex('courses').select('id', 'code');
  const semesters = await knex('semesters').select('id', 'code');
  
  // Get teachers and their course relationships
  const teachers = await knex('users').where('role', 'teacher').select('id', 'name');
  const teacherCourses = await knex('user_courses')
    .join('users', 'user_courses.user_id', 'users.id')
    .where('users.role', 'teacher')
    .select('user_courses.user_id', 'user_courses.course_id');

  const subjects = [];
  let subjectIdCounter = 100;

  // Subjects definitions by course
  const subjectsByCourse = {
    'CC': [
      { name: 'Algoritmos e Estruturas de Dados', code: 'AED001', credits: 4, semester: '2025-01' },
      { name: 'Programação Orientada a Objetos', code: 'POO001', credits: 4, semester: '2025-01' },
      { name: 'Banco de Dados', code: 'BD001', credits: 4, semester: '2025-01' },
      { name: 'Engenharia de Software', code: 'ES001', credits: 4, semester: '2025-02' },
      { name: 'Redes de Computadores', code: 'RC001', credits: 4, semester: '2025-02' },
      { name: 'Inteligência Artificial', code: 'IA001', credits: 4, semester: '2025-02' },
      { name: 'Sistemas Operacionais', code: 'SO001', credits: 4, semester: '2026-01' }
    ],
    'SI': [
      { name: 'Análise de Sistemas', code: 'AS001', credits: 4, semester: '2025-01' },
      { name: 'Gestão de Projetos', code: 'GP001', credits: 3, semester: '2025-01' },
      { name: 'Sistemas de Informação Gerencial', code: 'SIG001', credits: 4, semester: '2025-01' },
      { name: 'Desenvolvimento Web', code: 'DW001', credits: 4, semester: '2025-02' },
      { name: 'Segurança da Informação', code: 'SI001', credits: 3, semester: '2025-02' },
      { name: 'Business Intelligence', code: 'BI001', credits: 4, semester: '2025-02' },
      { name: 'Auditoria de Sistemas', code: 'AUS001', credits: 3, semester: '2026-01' }
    ],
    'ADS': [
      { name: 'Programação Web', code: 'PW001', credits: 4, semester: '2025-01' },
      { name: 'Mobile Development', code: 'MD001', credits: 4, semester: '2025-01' },
      { name: 'DevOps e Cloud Computing', code: 'DC001', credits: 4, semester: '2025-02' },
      { name: 'Testes de Software', code: 'TS001', credits: 3, semester: '2025-02' },
      { name: 'API e Microserviços', code: 'AM001', credits: 4, semester: '2025-02' },
      { name: 'UX/UI Design', code: 'UX001', credits: 3, semester: '2026-01' }
    ]
  };

  // Create subjects for each course and semester combination
  courses.forEach(course => {
    const courseSubjects = subjectsByCourse[course.code] || [];
    
    courseSubjects.forEach(subjectDef => {
      // Find the semester ID by code
      const semester = semesters.find(s => s.code === subjectDef.semester);
      if (!semester) {
        console.warn(`Semester ${subjectDef.semester} not found for subject ${subjectDef.name}`);
        return;
      }

      // Get teachers that are assigned to this course
      const courseTeachers = teacherCourses.filter(tc => tc.course_id === course.id);
      if (courseTeachers.length === 0) {
        console.warn(`No teachers found for course ${course.code}`);
        return;
      }

      // Assign random teacher from those assigned to this course
      const randomTeacherCourse = courseTeachers[Math.floor(Math.random() * courseTeachers.length)];
      const teacher = teachers.find(t => t.id === randomTeacherCourse.user_id);
      
      if (!teacher) {
        console.warn(`Teacher not found for course ${course.code}`);
        return;
      }
      
      subjects.push({
        id: `550e8400-e29b-41d4-a716-44665544${subjectIdCounter.toString().padStart(4, '0')}`,
        name: subjectDef.name,
        code: subjectDef.code,
        credits: subjectDef.credits,
        course_id: course.id,
        semester_id: semester.id,
        teacher_id: teacher.id
      });
      
      subjectIdCounter++;
    });
  });

  await knex('subjects').insert(subjects);
};
