# Rotas da API

## Rotas Criadas até o momento

### Testes (Temporárias)

- `GET /` - Retorna "Hello World!" - Pública
- `GET /alunos` - Retorna todos os alunos - Pública
- `POST /alunos` - Cria um novo aluno - Pública
- `GET /teste` - Testa o sistema de autenticação (Token e Papel de usuário) - Exclusivo de administrador

### Autenticação

- `POST /autenticacao/login` - Realiza login - Pública
- `PATCH /autenticacao/trocar/senha` - Realiza troca de senha

### Usuários

- `POST /usuarios` - Cria um novo usuário - Exclusivo de administrador

### Alunos

- `GET /frequencias/me/:anoLetivo` - Busca frequência do aluno de um ano letivo específico - Exclusivo de aluno

---

## Observação

Ao criar uma nova rota, atualize este README, seguindo o mesmo padrão das rotas já existentes.
