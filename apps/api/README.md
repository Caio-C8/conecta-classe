# Rotas da API

## Padrões de respostas

Todas as rotas têm um padrão de resposta sendo eles:

- `Sucesso`:

  ```bash
  {
    status: 200,
    sucesso: true,
    mensagem: "Mensagem de sucesso.",
    dados: {
      // Aqui vai o que é retornado podendo ser uma lista []
    },
  }
  ```

- `Erro`:

  ```bash
  {
    status: 400,
    sucesso: false,
    mensagem: "Erro de validação nos campos informados.",
    erros: [
      {
        campo: "usuario",
        mensagem: "Usuário inválido.",
      },
    ],
  }
  ```

  Ou:

  ```bash
  {
    status: 401,
    sucesso: false,
    mensagem: "Mensagem de erro.",
    erros: null,
  }
  ```

## Rotas Criadas até o momento

### Testes (Temporárias)

- `GET /` - Retorna "Hello World!" - Pública
- `GET /alunos` - Retorna todos os alunos - Pública
- `POST /alunos` - Cria um novo aluno - Pública
- `GET /teste` - Testa o sistema de autenticação (Token e Papel de usuário) - Exclusivo de administrador

### Autenticação

- `POST /autenticacao/login` - Realiza login - Pública - Ex:

  ```bash
  {
    status: 201,
    sucesso: true,
    mensagem: "Login realizado com sucesso.",
    dados: {
      token: "token",
      usuario: {
        id: 3,
        nome: "Ana Clara",
        papel: "ALUNO",
        trocar_senha: false,
      },
    },
  }
  ```

- `PATCH /autenticacao/trocar/senha` - Realiza troca de senha - Necessário autenticação - Ex:

  ```bash
  {
    status: 200,
    sucesso: true,
    mensagem: "Senha alterada com sucesso.",
    dados: {
      token: "token",
      usuario: {
        id: 4,
        nome: "Carlos Eduardo",
        papel: "PROFESSOR",
        trocar_senha: false,
      },
    },
  }
  ```

### Usuários

- `POST /usuarios` - Cria um novo usuário - Necessário autenticação - Exclusivo de administrador - Ex:

  ```bash
  {
    status: 201,
    sucesso: true,
    mensagem: "Usuário criado com sucesso.",
    dados: {
      id: 6,
      usuario: "teste1",
      senha: "$2b$10$.0k.H7upbCKY.pdf.cT0H.K7gpdZrp1jpq8XHM5ihSHHP0b2.UoOm",
      nome: "Teste",
      nome_search: "teste",
      trocar_senha: true,
      papel: "ALUNO",
      deleted_at: null,
      created_at: "2026-04-24T11:17:23.127Z",
      updated_at: "2026-04-24T11:17:23.127Z",
    },
  }
  ```

### Alunos

- `GET /frequencias/me/:anoLetivo` - Busca frequência do aluno de um ano letivo específico - Necessário autenticação - Exclusivo de aluno - Ex:

  ```bash
  {
    status: 200,
    sucesso: true,
    mensagem: "Operação realizada com sucesso",
    dados: {
      usuario_id: 3,
      ano_letivo: 2025,
      visao: "POR_DISCIPLINA",
      turma: {
        identificacao: "C",
        serie: 9,
        nivel_ensino: "FUNDAMENTAL_2",
      },
      frequencias: [
        {
          disciplina: {
            id: 1,
            nome: "Matemática",
          },
          aulas_realizadas: 1,
          faltas: 0,
          presenca_percentual: 100,
        },
      ],
    },
  }
  ```

  Ou:

  ```bash
  {
    status: 200,
    sucesso: true,
    mensagem: "Operação realizada com sucesso",
    dados: {
      usuario_id: 2,
      ano_letivo: 2026,
      visao: "GERAL",
      turma: {
        identificacao: "B",
        serie: 2,
        nivel_ensino: "FUNDAMENTAL_1",
      },
      frequencia: {
        total_aulas: 2,
        total_faltas: 1,
        presenca_percentual: 50,
      },
    },
  }
  ```

- `GET /eventos/me/:anoLetivo` - Busca eventos do aluno de um ano letivo específico - Necessário autenticação - Exclusivo de aluno - Ex:

  ```bash
  {
    status: 200,
    sucesso: true,
    mensagem: "Operação realizada com sucesso",
    dados: [
      {
        id: 1,
        turma_id: 10,
        disciplina_id: 7,
        criador_id: 4,
        titulo: "Prova Bimestral de Exatas",
        descricao: "Cairá todo o conteúdo sobre Geometria Analítica.",
        tipo_evento: "PROVA",
        valor_nota: 10,
        data_evento: "2026-04-25T15:15:12.860Z",
        created_at: "2026-04-24T15:15:12.862Z",
        updated_at: "2026-04-24T15:15:12.862Z",
        disciplina: {
          id: 7,
          nome: "Matemática",
          deleted_at: null,
          created_at: "2026-04-24T15:15:12.780Z",
          updated_at: "2026-04-24T15:15:12.780Z",
        },
      },
      {
        id: 2,
        turma_id: 10,
        disciplina_id: 8,
        criador_id: 4,
        titulo: "Entrega do Trabalho",
        descricao: "Maquete sobre divisão celular.",
        tipo_evento: "ATIVIDADE",
        valor_nota: 5,
        data_evento: "2026-05-01T15:15:12.860Z",
        created_at: "2026-04-24T15:15:12.862Z",
        updated_at: "2026-04-24T15:15:12.862Z",
        disciplina: {
          id: 8,
          nome: "Biologia",
          deleted_at: null,
          created_at: "2026-04-24T15:15:12.783Z",
          updated_at: "2026-04-24T15:15:12.783Z",
        },
      },
      {
        id: 3,
        turma_id: 10,
        disciplina_id: 8,
        criador_id: 4,
        titulo: "Feira de Ciências",
        descricao: "Apresentação obrigatória no pátio principal.",
        tipo_evento: "GERAL",
        valor_nota: null,
        data_evento: "2026-05-24T15:15:12.860Z",
        created_at: "2026-04-24T15:15:12.862Z",
        updated_at: "2026-04-24T15:15:12.862Z",
        disciplina: {
          id: 8,
          nome: "Biologia",
          deleted_at: null,
          created_at: "2026-04-24T15:15:12.783Z",
          updated_at: "2026-04-24T15:15:12.783Z",
        },
      },
    ],
  }
  ```

---

## Observação

Ao criar uma nova rota, atualize este README, seguindo o mesmo padrão das rotas já existentes.
