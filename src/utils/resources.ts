// Definição de recursos disponíveis por role para uso no frontend
export interface Resource {
  name: string;
  label: string;
  actions: string[];
}

export interface UserResources {
  role: string;
  resources: Resource[];
}

export const getResourcesByRole = (role: string): Resource[] => {
  const resources: Record<string, Resource[]> = {
    admin: [
      {
        name: 'users',
        label: 'Usuários',
        actions: ['create', 'read', 'update', 'delete', 'whoami']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'listStudents',
          'listTeachers',
          'createSubject',
          'updateSubject'
        ]
      },
      {
        name: 'semesters',
        label: 'Semestres',
        actions: ['create', 'read', 'update', 'delete']
      }
    ],
    coordinator: [
      {
        name: 'users',
        label: 'Usuários',
        actions: ['create', 'read', 'update', 'whoami']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: [
          'create',
          'read',
          'update',
          'listStudents',
          'listTeachers',
          'createSubject',
          'updateSubject'
        ]
      }
    ],
    teacher: [
      {
        name: 'users',
        label: 'Usuários',
        actions: ['read', 'whoami']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: [
          'read',
          'listStudents',
          'createSubject',
          'updateSubject'
        ]
      }
    ],
    student: [
      {
        name: 'users',
        label: 'Usuários',
        actions: ['whoami']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: ['read', 'enrollSubject']
      },
    ]
  };

  return resources[role] || [];
};

