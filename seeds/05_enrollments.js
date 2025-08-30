/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get students and subjects from their courses
  const students = await knex('users').where('role', 'student').select('id', 'course_id');
  
  // Subjects now have course_id directly
  const subjects = await knex('subjects').select('id as subject_id', 'course_id');

  const enrollments = [];
  let enrollmentIdCounter = 200;

  // Create enrollments for each student
  students.forEach(student => {
    // Get subjects from student's course
    const studentSubjects = subjects.filter(s => s.course_id === student.course_id);
    
    // Enroll student in 60-80% of available subjects randomly
    const enrollmentCount = Math.floor(studentSubjects.length * (0.6 + Math.random() * 0.2));
    const shuffledSubjects = studentSubjects.sort(() => 0.5 - Math.random());
    const selectedSubjects = shuffledSubjects.slice(0, enrollmentCount);

    selectedSubjects.forEach(subject => {
      // Random enrollment date within the last 30 days
      const enrollmentDate = new Date();
      enrollmentDate.setDate(enrollmentDate.getDate() - Math.floor(Math.random() * 30));
      
      // Random status (most active, some completed, few dropped)
      const statusRandom = Math.random();
      let status = 'active';
      if (statusRandom < 0.1) status = 'dropped';
      else if (statusRandom < 0.3) status = 'completed';

      enrollments.push({
        id: `550e8400-e29b-41d4-a716-44665544${enrollmentIdCounter.toString().padStart(4, '0')}`,
        student_id: student.id,
        subject_id: subject.subject_id,
        enrollment_date: enrollmentDate,
        status: status
      });
      
      enrollmentIdCounter++;
    });
  });

  await knex('enrollments').insert(enrollments);
};
