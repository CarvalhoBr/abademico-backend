-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar usuário para a aplicação se não existir
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'academic_user') THEN

      CREATE ROLE academic_user LOGIN PASSWORD 'academic_pass';
   END IF;
END
$do$;

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE academic_system TO academic_user;
