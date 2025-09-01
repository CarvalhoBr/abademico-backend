# Sistema Acadêmico com RBAC

Sistema acadêmico desenvolvido para demonstrar implementação de RBAC (Role-Based Access Control) com Keycloak.

## 🚀 Tecnologias

- **Node.js 22** - Runtime
- **TypeScript** - Linguagem com tipagem estática
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Knex.js** - Query builder e migrations
- **Docker** - Containerização
- **Keycloak** - Autenticação e autorização (integração futura)

## 📋 Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- PostgreSQL (caso não use Docker)

## 🔧 Instalação

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd academic-system-rbac
```

2. Inicie os serviços:
```bash
docker-compose up -d
```

3. Execute as migrations:
```bash
docker-compose exec app npm run migrate
```

4. Execute os seeds (opcional):
```bash
docker-compose exec app npm run seed
```

### Instalação Local

1. Clone o repositório:
```bash
git clone <repository-url>
cd academic-system-rbac
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrations:
```bash
npm run migrate
```

5. Execute os seeds (opcional):
```bash
npm run seed
```

6. Inicie o servidor:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

### Entidades Principais

- **Users** - Usuários do sistema (estudantes, professores, coordenadores, admins)
- **Courses** - Cursos oferecidos
- **Semesters** - Semestres de cada curso
- **Subjects** - Disciplinas de cada semestre
- **Enrollments** - Inscrições de estudantes em disciplinas

### Relacionamentos

- User N:N Course (através de user_courses)
- Course 1:N Semester
- Semester 1:N Subject
- User (teacher) 1:N Subject
- User (student) N:N Subject (através de Enrollment)

## 📡 API Endpoints

### Health Check
- `GET /health` - Status da API

### Usuários
- `POST /api/users/:role` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Remover usuário
- `GET /api/users/:id/courses` - Listar cursos do usuário
- `POST /api/users/:id/courses` - Adicionar curso ao usuário
- `DELETE /api/users/:id/courses/:courseId` - Remover curso do usuário

### Cursos
- `POST /api/courses` - Criar curso
- `GET /api/courses` - Listar cursos
- `GET /api/courses/:id` - Obter curso por ID
- `PUT /api/courses/:id` - Atualizar curso
- `DELETE /api/courses/:id` - Remover curso
- `GET /api/courses/:id/semesters` - Listar semestres do curso
- `GET /api/courses/:id/students` - Listar estudantes do curso
- `GET /api/courses/:id/teachers` - Listar professores do curso
- `POST /api/courses/:id/subjects` - Criar disciplina no curso
- `GET /api/courses/:id/:semesterId/subjects` - Listar disciplinas do curso por semestre
- `POST /api/courses/:courseId/subjects/:subjectId/enroll/:userId` - Inscrever estudante na disciplina
- `DELETE /api/courses/:courseId/subjects/:subjectId/enrollment/:userId` - Cancelar inscrição do estudante

### Semestres
- `POST /api/semesters` - Criar semestre
- `GET /api/semesters` - Listar semestres
- `GET /api/semesters/:id` - Obter semestre por ID
- `PUT /api/semesters/:id` - Atualizar semestre
- `DELETE /api/semesters/:id` - Remover semestre
- `GET /api/semesters/:id/subjects` - Listar disciplinas do semestre

### Disciplinas
- `GET /api/subjects` - Listar disciplinas
- `GET /api/subjects/:id` - Obter disciplina por ID
- `PUT /api/subjects/:id` - Atualizar disciplina
- `DELETE /api/subjects/:id` - Remover disciplina
- `GET /api/subjects/:id/enrollments` - Listar inscrições da disciplina
- `POST /api/subjects/:id/enroll` - Inscrever estudante na disciplina
- `DELETE /api/subjects/:subjectId/enrollments/:studentId` - Cancelar inscrição

### Inscrições
- `POST /api/enrollments` - Criar inscrição
- `GET /api/enrollments` - Listar inscrições
- `GET /api/enrollments/:id` - Obter inscrição por ID
- `PUT /api/enrollments/:id` - Atualizar status da inscrição
- `DELETE /api/enrollments/:id` - Remover inscrição

## 🧪 Scripts Disponíveis

```bash
npm run build      # Compilar TypeScript para JavaScript
npm start          # Iniciar servidor em produção (requer build)
npm run dev        # Iniciar servidor em desenvolvimento com hot reload
npm run migrate    # Executar migrations
npm run migrate:rollback # Reverter última migration
npm run seed       # Executar seeds
npm test           # Executar testes
npm run test:watch # Executar testes em modo watch
```

## 🐳 Docker

### Serviços Disponíveis

- **app** - Aplicação Node.js (porta 3000, debug 9229)
- **postgres** - Banco PostgreSQL (porta 5432)
- **keycloak** - Servidor Keycloak (porta 8080)
- **postgres-keycloak** - Banco dedicado para Keycloak

### Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs da aplicação
docker-compose logs -f app

# Executar migrations
docker-compose exec app npm run migrate

# Executar seeds
docker-compose exec app npm run seed

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

## 🐛 Debug

O projeto está configurado para debug remoto:

- **Porta de Debug**: 9229
- **Host**: 0.0.0.0 (acessível externamente ao container)

### VS Code Debug Configuration

Adicione ao seu `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}/src",
      "remoteRoot": "/app/src",
      "protocol": "inspector"
    }
  ]
}
```

## 🔐 Keycloak (Integração Futura)

O Keycloak está configurado no Docker Compose para integração futura:

- **URL**: http://localhost:8080
- **Admin**: admin / admin
- **Realm**: academic (será configurado)
- **Client**: academic-client (será configurado)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📚 Documentação Adicional

- [PRD - Product Requirements Document](PRD.md)
- Documentação da API (será adicionada)
- Guia de Deploy (será adicionado)
