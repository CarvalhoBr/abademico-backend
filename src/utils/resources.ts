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
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'semesters',
        label: 'Semestres',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'subjects',
        label: 'Disciplinas',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'enrollments',
        label: 'Inscrições',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'reports',
        label: 'Relatórios',
        actions: ['read', 'export']
      }
    ],
    coordinator: [
      {
        name: 'users',
        label: 'Usuários',
        actions: ['create', 'read', 'update']
      },
      {
        name: 'courses',
        label: 'Cursos',
        actions: ['read', 'update']
      },
      {
        name: 'semesters',
        label: 'Semestres',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'subjects',
        label: 'Disciplinas',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        name: 'enrollments',
        label: 'Inscrições',
        actions: ['read', 'update']
      },
      {
        name: 'reports',
        label: 'Relatórios',
        actions: ['read', 'export']
      }
    ],
    teacher: [
      {
        name: 'subjects',
        label: 'Minhas Disciplinas',
        actions: ['read', 'update']
      },
      {
        name: 'enrollments',
        label: 'Inscrições',
        actions: ['read', 'update']
      },
      {
        name: 'students',
        label: 'Estudantes',
        actions: ['read']
      },
      {
        name: 'grades',
        label: 'Notas',
        actions: ['create', 'read', 'update']
      }
    ],
    student: [
      {
        name: 'subjects',
        label: 'Disciplinas Disponíveis',
        actions: ['read']
      },
      {
        name: 'enrollments',
        label: 'Minhas Inscrições',
        actions: ['create', 'read', 'delete']
      },
      {
        name: 'grades',
        label: 'Minhas Notas',
        actions: ['read']
      },
      {
        name: 'schedule',
        label: 'Meu Cronograma',
        actions: ['read']
      }
    ]
  };

  return resources[role] || [];
};

