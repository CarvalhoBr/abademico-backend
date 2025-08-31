# 📬 Postman Collection - Academic System RBAC

Collection completa para testar todos os endpoints da API do Sistema Acadêmico.

## 📥 Como Importar

### 1. **Collection**
- Abra o Postman
- Clique em **Import**
- Selecione o arquivo: `Academic System RBAC.postman_collection.json`

### 2. **Environment**
- No Postman, vá em **Environments**
- Clique em **Import**
- Selecione o arquivo: `Academic System RBAC.postman_environment.json`
- **Ative o environment** clicando nele

## 🚀 Como Usar

### **1. Iniciar Sistema**
```bash
docker compose up -d
docker compose exec app npm run migrate
docker compose exec app npm run seed
```

### **2. Testar Health Check**
- Execute: `Health Check > Health Check`
- Deve retornar status 200 com informações da API

### **3. Fluxo Recomendado de Testes**

#### **📚 Passo 1: Courses**
1. `Get All Courses` - Ver cursos existentes (seeds)
2. `Create Course` - Criar novo curso
3. `Get Course Semesters` - Ver semestres do curso
4. `Get Course Students` - Ver estudantes do curso
5. `Get Course Teachers` - Ver professores do curso

#### **👥 Passo 2: Users**
1. `Get All Users` - Ver usuários existentes (seeds)
2. `Create Student` - Criar novo estudante
3. `Create Teacher` - Criar novo professor
4. `Get Users by Role` - Filtrar por role

#### **📅 Passo 3: Semesters**
1. `Get All Semesters` - Ver semestres existentes
2. `Create Semester` - Criar novo semestre
3. `Get Semester Subjects` - Ver disciplinas do semestre

#### **📖 Passo 4: Subjects**
1. `Get All Subjects` - Ver disciplinas existentes
2. `Create Subject` - Criar nova disciplina
3. `Get Subject Enrollments` - Ver inscrições da disciplina

#### **✍️ Passo 5: Enrollments**
1. `Get All Enrollments` - Ver inscrições existentes
2. `Enroll Student in Subject` - Inscrever estudante
3. `Update Enrollment Status` - Alterar status
4. `Get Enrollments by Status` - Filtrar por status

## 🔧 Variáveis de Environment

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `baseUrl` | URL base da API | `http://localhost:3000` |
| `apiUrl` | URL da API | `{{baseUrl}}/api` |
| `courseId` | ID do curso (CC) | `550e8400-e29b-41d4-a716-446655440001` |
| `semesterId` | ID do semestre | `550e8400-e29b-41d4-a716-446655440050` |
| `studentId` | ID de um estudante | `550e8400-e29b-41d4-a716-446655440100` |
| `teacherId` | ID de um professor | `550e8400-e29b-41d4-a716-446655440020` |
| `coordinatorId` | ID de um coordenador | `550e8400-e29b-41d4-a716-446655440011` |
| `adminId` | ID de um admin | `550e8400-e29b-41d4-a716-446655440010` |

## 📝 Exemplos de Requests

### **Criar Estudante**
```json
POST /api/users/student
{
  "name": "João Silva",
  "email": "joao.silva@student.com",
  "courseIds": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

### **Criar Curso**
```json
POST /api/courses
{
  "name": "Engenharia de Software",
  "code": "ES",
  "description": "Curso de Bacharelado em Engenharia de Software",
  "coordinatorId": "550e8400-e29b-41d4-a716-446655440011"
}
```

### **Criar Semestre**
```json
POST /api/semesters
{
  "code": "2025-03",
  "courseId": "550e8400-e29b-41d4-a716-446655440001",
  "startDate": "2025-08-01",
  "endDate": "2025-12-15"
}
```

### **Criar Disciplina**
```json
POST /api/courses/{{courseId}}/subjects
{
  "name": "Programação Web Avançada",
  "code": "PWA001",
  "credits": 4,
  "semesterId": "550e8400-e29b-41d4-a716-446655440050",
  "teacherId": "550e8400-e29b-41d4-a716-446655440020"
}
```

### **Inscrever Estudante**
```json
POST /api/subjects/{{subjectId}}/enroll
{
  "studentId": "550e8400-e29b-41d4-a716-446655440100"
}
```

## 🔍 Validações Implementadas

### **Users**
- ✅ Email único
- ✅ Role válida (student, teacher, coordinator, admin)
- ✅ CourseId obrigatório para estudantes
- ✅ CourseId não permitido para outros roles

### **Courses**
- ✅ Code único
- ✅ Coordinator deve ter role "coordinator"

### **Semesters**
- ✅ Code formato YYYY-SS
- ✅ Combinação code + courseId única
- ✅ StartDate < EndDate

### **Subjects**
- ✅ Combinação code + semesterId única
- ✅ Credits > 0
- ✅ Teacher deve ter role "teacher"

### **Enrollments**
- ✅ Combinação studentId + subjectId única
- ✅ Student deve ter role "student"
- ✅ Status válido (active, completed, dropped)

## 🚨 Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `400` | Bad Request - Dados inválidos |
| `404` | Not Found - Recurso não encontrado |
| `409` | Conflict - Recurso já existe |
| `422` | Validation Error - Erro de validação |
| `500` | Internal Server Error - Erro interno |

## 🎯 Dicas de Uso

1. **Use as variáveis de environment** para facilitar os testes
2. **Execute os requests em ordem** para manter consistência
3. **Copie IDs dos responses** para usar em outros requests
4. **Verifique os logs** do container em caso de erro
5. **Use o debugger** VS Code para investigar problemas

## 🔗 Links Úteis

- **API Health**: http://localhost:3000/health
- **API Base**: http://localhost:3000/api
- **Keycloak**: http://localhost:8080 (admin/admin)
- **Logs**: `docker compose logs app -f`
