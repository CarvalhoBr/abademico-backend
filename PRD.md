# PRD - Sistema Acadêmico com RBAC

## 1. Visão Geral

Sistema acadêmico desenvolvido para demonstrar implementação de RBAC (Role-Based Access Control) com Keycloak. O sistema gerencia usuários, cursos, semestres e disciplinas em um ambiente educacional.

## 2. Stack Tecnológica

- **Runtime**: Node.js 22
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL
- **Query Builder**: Knex.js
- **Containerização**: Docker & Docker Compose
- **Autenticação/Autorização**: Keycloak (integração futura)

## 3. Entidades do Sistema

### 3.1 Usuário (User)
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string (unique)",
  "role": "enum [student, teacher, coordinator, admin]",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Regras de Negócio:**
- Email deve ser único no sistema
- Role define o tipo de usuário no sistema
- Relacionamento com cursos é N:N através da tabela `user_courses`

### 3.2 Curso (Course)
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string (unique)",
  "description": "string (nullable)",
  "coordinatorId": "uuid (nullable)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Regras de Negócio:**
- Code deve ser único (ex: "CC", "SI", "ADS")
- Um curso pode ter um coordenador (usuário com role coordinator)

### 3.3 Semestre (Semester)
```json
{
  "id": "uuid",
  "code": "string",
  "courseId": "uuid",
  "startDate": "date",
  "endDate": "date",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Regras de Negócio:**
- Code segue formato "YYYY-SS" (ex: "2025-01", "2025-02")
- Combinação de code + courseId deve ser única
- startDate deve ser anterior a endDate

### 3.4 Disciplina (Subject)
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "credits": "integer",
  "semesterId": "uuid",
  "teacherId": "uuid (nullable)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Regras de Negócio:**
- Combinação de code + semesterId deve ser única
- Credits deve ser um valor positivo
- Teacher deve ser um usuário com role "teacher"

### 3.5 Inscrição (Enrollment)
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "subjectId": "uuid",
  "enrollmentDate": "timestamp",
  "status": "enum [active, completed, dropped]",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Regras de Negócio:**
- Combinação de studentId + subjectId deve ser única
- Student deve ser um usuário com role "student"
- Status padrão é "active"

## 4. Funcionalidades por Entidade

### 4.1 Usuários
**Endpoints:**
- `POST /users/:role` - Criar usuário com role específica
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Obter usuário por ID
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário
- `GET /users/:id/courses` - Listar cursos do usuário
- `POST /users/:id/courses` - Adicionar curso ao usuário
- `DELETE /users/:id/courses/:courseId` - Remover curso do usuário

**Validações:**
- Role deve ser um dos valores válidos: student, teacher, coordinator, admin
- Email deve ser válido e único
- CourseId obrigatório apenas para role "student"

### 4.2 Cursos
**Endpoints:**
- `POST /courses` - Criar curso
- `GET /courses` - Listar todos os cursos
- `GET /courses/:id` - Obter curso por ID
- `PUT /courses/:id` - Atualizar curso
- `DELETE /courses/:id` - Remover curso

**Funcionalidades Adicionais:**
- `GET /courses/:id/semesters` - Listar semestres do curso
- `GET /courses/:id/students` - Listar estudantes do curso
- `GET /courses/:id/teachers` - Listar professores do curso
- `POST /courses/:id/subjects` - Criar disciplina no curso
- `GET /courses/:id/:semesterId/subjects` - Listar disciplinas do curso por semestre
- `POST /courses/:courseId/subjects/:subjectId/enroll/:userId` - Inscrever estudante na disciplina
- `DELETE /courses/:courseId/subjects/:subjectId/enrollment/:userId` - Cancelar inscrição do estudante

### 4.3 Semestres
**Endpoints:**
- `POST /semesters` - Criar semestre
- `GET /semesters` - Listar todos os semestres
- `GET /semesters/:id` - Obter semestre por ID
- `PUT /semesters/:id` - Atualizar semestre
- `DELETE /semesters/:id` - Remover semestre

**Funcionalidades Adicionais:**
- `GET /semesters/:id/subjects` - Listar disciplinas do semestre

### 4.4 Disciplinas
**Endpoints:**
- `GET /subjects` - Listar todas as disciplinas
- `GET /subjects/:id` - Obter disciplina por ID
- `PUT /subjects/:id` - Atualizar disciplina
- `DELETE /subjects/:id` - Remover disciplina

**Funcionalidades Adicionais:**
- `GET /subjects/:id/enrollments` - Listar inscrições da disciplina
- `POST /subjects/:id/enroll` - Inscrever estudante na disciplina
- `DELETE /subjects/:subjectId/enrollments/:studentId` - Cancelar inscrição

### 4.5 Inscrições
**Endpoints:**
- `POST /enrollments` - Criar inscrição
- `GET /enrollments` - Listar todas as inscrições
- `GET /enrollments/:id` - Obter inscrição por ID
- `PUT /enrollments/:id` - Atualizar status da inscrição
- `DELETE /enrollments/:id` - Remover inscrição

## 5. Estrutura do Banco de Dados

### 5.1 Relacionamentos
- **User** N:N **Course** (através de user_courses)
- **Course** 1:N **Semester**
- **Semester** 1:N **Subject**
- **User** (teacher) 1:N **Subject**
- **User** (student) N:N **Subject** (através de Enrollment)

### 5.2 Índices Recomendados
- `users.email` (unique)
- `courses.code` (unique)
- `semesters.code, semesters.course_id` (unique composite)
- `subjects.code, subjects.semester_id` (unique composite)
- `enrollments.student_id, enrollments.subject_id` (unique composite)

## 6. Estrutura do Projeto

```
/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── types/
│   └── utils/
├── dist/                 # Arquivos compilados do TypeScript
├── migrations/
├── seeds/
├── tests/
├── docker-compose.yml
├── Dockerfile
├── tsconfig.json
├── nodemon.json
├── package.json
└── README.md
```

## 7. Docker Compose

### 7.1 Serviços
- **app**: Aplicação Node.js
- **postgres**: Banco de dados PostgreSQL
- **keycloak**: Servidor de autenticação (para integração futura)
- **postgres-keycloak**: Banco dedicado para o Keycloak

### 7.2 Portas
- App: 3000
- PostgreSQL: 5432
- Keycloak: 8080

### 7.3 Volumes
- Dados do PostgreSQL persistidos
- Dados do Keycloak persistidos

## 8. Variáveis de Ambiente

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=academic_system
DB_USER=postgres
DB_PASSWORD=postgres

# Application
PORT=3000
NODE_ENV=development

# Keycloak (futuro)
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=academic
KEYCLOAK_CLIENT_ID=academic-client
```

## 9. Responses Padrão da API

### 9.1 Sucesso
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### 9.2 Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### 9.3 Paginação
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 10. Validações e Constraints

### 10.1 Usuários
- Nome: obrigatório, mínimo 2 caracteres
- Email: obrigatório, formato válido, único
- Role: obrigatório, valores válidos
- CourseIds: obrigatório para estudantes (array de UUIDs)

### 10.2 Cursos
- Nome: obrigatório, mínimo 2 caracteres
- Code: obrigatório, único, formato alfanumérico
- CoordinatorId: deve ser um usuário com role "coordinator"

### 10.3 Semestres
- Code: obrigatório, formato "YYYY-SS"
- CourseId: obrigatório, deve existir
- StartDate/EndDate: obrigatórios, startDate < endDate

### 10.4 Disciplinas
- Nome: obrigatório, mínimo 2 caracteres
- Code: obrigatório, único por semestre
- Credits: obrigatório, valor positivo
- SemesterId: obrigatório, deve existir
- TeacherId: deve ser um usuário com role "teacher"

## 11. Seeds Iniciais

### 11.1 Usuários
- 1 Admin
- 2 Coordenadores
- 5 Professores
- 20 Estudantes

### 11.2 Cursos
- Ciência da Computação
- Sistemas de Informação
- Análise e Desenvolvimento de Sistemas

### 11.3 Semestres
- 2025-01 e 2025-02 para cada curso

### 11.4 Disciplinas
- 5-8 disciplinas por semestre
- Professores atribuídos aleatoriamente

## 12. Próximos Passos (Pós-Implementação)

1. Integração com Keycloak
2. Implementação de middlewares de autorização
3. Testes de permissionamento por role
4. Dashboard administrativo
5. API de relatórios

---

**Versão:** 1.1  
**Data:** Janeiro 2025  
**Autor:** Sistema de Desenvolvimento  
**Changelog v1.1:** Migração para TypeScript com tipagem completa
