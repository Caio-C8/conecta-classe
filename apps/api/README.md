# Rotas da API

## Sumário

- [Padrões de respostas](#padrões-de-respostas)
- [Rotas Criadas até o momento](#rotas-criadas-até-o-momento)
  - [Testes (Temporárias)](#testes-temporárias)
  - [Autenticação](#autenticação)
  - [Usuários](#usuários)
  - [Disciplinas](#disciplinas)
  - [Frequências](#frequências)
  - [Eventos](#eventos)
  - [Rendimentos](#rendimentos)
  - [Professores](#professores)
  - [Turmas](#turmas)
- [Observação](#observação)

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

- `POST /autenticacao/login`
  - descricao: Realiza login no sistema.
  - requerimentos: Autenticação: Não | Acessível por: Público
  - corpo da requisicao:
    ```json
    {
      "usuario": "string",
      "senha": "string"
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Login realizado com sucesso.",
      "dados": {
        "token": "string",
        "usuario": {
          "id": 1,
          "nome": "string",
          "papel": "ALUNO",
          "trocar_senha": false
        }
      }
    }
    ```

- `PATCH /autenticacao/trocar/senha`
  - descricao: Realiza troca de senha para o usuário logado.
  - requerimentos: Autenticação: Sim | Acessível por: Qualquer usuário logado
  - corpo da requisicao:
    ```json
    {
      "nova_senha": "string",
      "confirmar_senha": "string"
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Senha alterada com sucesso.",
      "dados": {
        "token": "string",
        "usuario": {
          "id": 1,
          "nome": "string",
          "papel": "ALUNO",
          "trocar_senha": false
        }
      }
    }
    ```

### Usuários

- `POST /usuarios`
  - descricao: Cria um novo usuário.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "usuario": "string",
      "senha": "string",
      "nome": "string",
      "trocar_senha": true,
      "papel": "ADMINISTRADOR | ALUNO | PROFESSOR",
      "cargo": "DIRETOR | COORDENADOR | SECRETARIO"
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 201,
      "sucesso": true,
      "mensagem": "Usuário criado com sucesso.",
      "dados": {
        "id": 1,
        "usuario": "string",
        "nome": "string",
        "nome_search": "string",
        "papel": "ALUNO",
        "trocar_senha": true,
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `GET /usuarios`
  - descricao: Busca todos os usuários de forma paginada.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "dados": [
          {
            "id": 1,
            "usuario": "string",
            "nome": "string",
            "nome_search": "string",
            "papel": "ALUNO",
            "trocar_senha": false,
            "deleted_at": null,
            "created_at": "string",
            "updated_at": "string"
          },
          "..."
        ],
        "meta": {
          "total": 1,
          "pagina": 1,
          "limite": 10,
          "ultima_pagina": 1
        }
      }
    }
    ```

- `PATCH /usuarios/:id`
  - descricao: Atualiza dados de um usuário.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "usuario": "string",
      "senha": "string",
      "nome": "string",
      "cargo": "DIRETOR | COORDENADOR | SECRETARIO",
      "trocar_senha": false
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "id": 1,
        "usuario": "string",
        "nome": "string",
        "nome_search": "string",
        "papel": "ALUNO",
        "trocar_senha": false,
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /usuarios/:id/inativar`
  - descricao: Inativa (soft delete) um usuário.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "id": 1,
        "usuario": "string",
        "nome": "string",
        "nome_search": "string",
        "papel": "ALUNO",
        "trocar_senha": false,
        "deleted_at": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /usuarios/:id/ativar`
  - descricao: Ativa um usuário inativado.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "id": 1,
        "usuario": "string",
        "nome": "string",
        "nome_search": "string",
        "papel": "ALUNO",
        "trocar_senha": false,
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

### Disciplinas

- `POST /disciplinas`
  - descricao: Cria uma nova disciplina.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "nome": "string"
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 201,
      "sucesso": true,
      "mensagem": "Disciplina criada com sucesso.",
      "dados": {
        "id": 1,
        "nome": "string",
        "nome_search": "string",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `GET /disciplinas`
  - descricao: Busca todas as disciplinas de forma paginada.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "dados": [
          {
            "id": 1,
            "nome": "string",
            "nome_search": "string",
            "deleted_at": null,
            "created_at": "string",
            "updated_at": "string"
          },
          "..."
        ],
        "meta": {
          "total": 1,
          "pagina": 1,
          "limite": 10,
          "ultima_pagina": 1
        }
      }
    }
    ```

- `PATCH /disciplinas/:id`
  - descricao: Atualiza dados de uma disciplina.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "nome": "string"
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Disciplina atualizada com sucesso.",
      "dados": {
        "id": 1,
        "nome": "string",
        "nome_search": "string",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /disciplinas/:id/inativar`
  - descricao: Inativa (soft delete) uma disciplina.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Disciplina inativada com sucesso.",
      "dados": {
        "id": 1,
        "nome": "string",
        "nome_search": "string",
        "deleted_at": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /disciplinas/:id/ativar`
  - descricao: Ativa uma disciplina inativada.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Disciplina ativada com sucesso.",
      "dados": {
        "id": 1,
        "nome": "string",
        "nome_search": "string",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

### Frequências

- `GET /frequencias/me/:anoLetivo`
  - descricao: Busca a frequência do aluno em um ano letivo específico.
  - requerimentos: Autenticação: Sim | Acessível por: Aluno
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "usuario_id": 1,
        "ano_letivo": 2026,
        "visao": "POR_DISCIPLINA",
        "porcentagem_frequencia_geral": 100,
        "total_faltas": 0,
        "total_aulas": 10,
        "turma": {
          "identificacao": "A",
          "serie": 1,
          "nivel_ensino": "MEDIO"
        },
        "frequencias": [
          {
            "disciplina": {
              "id": 1,
              "nome": "string"
            },
            "aulas_realizadas": 10,
            "faltas": 0,
            "presenca_percentual": 100
          },
          "..."
        ]
      }
    }
    ```

### Eventos

- `GET /eventos/me/:anoLetivo`
  - descricao: Busca eventos do aluno de um ano letivo específico.
  - requerimentos: Autenticação: Sim | Acessível por: Aluno
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": [
        {
          "id": 1,
          "turma_id": 1,
          "disciplina_id": 1,
          "criador_id": 1,
          "titulo": "string",
          "descricao": "string",
          "tipo_evento": "PROVA",
          "valor_nota": 10,
          "data_evento": "string",
          "created_at": "string",
          "updated_at": "string",
          "disciplina": {
            "id": 1,
            "nome": "string",
            "deleted_at": null,
            "created_at": "string",
            "updated_at": "string"
          }
        },
        "..."
      ]
    }
    ```

### Rendimentos

- `GET /rendimentos/me/:anoLetivo`
  - descricao: Busca os rendimentos (notas) do aluno de um ano letivo específico.
  - requerimentos: Autenticação: Sim | Acessível por: Aluno
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "usuario_id": 1,
        "ano_letivo": 2026,
        "turma": {
          "identificacao": "A",
          "serie": 1,
          "nivel_ensino": "MEDIO"
        },
        "media_geral": 10,
        "rendimentos": [
          {
            "disciplina": {
              "id": 1,
              "nome": "string"
            },
            "nota_total": 10,
            "situacao": "CURSANDO",
            "eventos": [
              {
                "id": 1,
                "titulo": "string",
                "tipo_evento": "PROVA",
                "data_evento": "string",
                "nota_obtida": 10,
                "valor_nota": 10
              },
              "..."
            ]
          },
          "..."
        ]
      }
    }
    ```

### Professores

- `GET /professor/turmas`
  - descricao: Busca as turmas que estão sob responsabilidade do professor.
  - requerimentos: Autenticação: Sim | Acessível por: Professor
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": [
        {
          "id": 1,
          "professor_id": 1,
          "turma_id": 1,
          "disciplina_id": 1,
          "created_at": "string",
          "updated_at": "string",
          "turma": {
            "id": 1,
            "identificacao": "string",
            "serie": 1,
            "nivel_ensino": "MEDIO"
          },
          "disciplina": {
            "id": 1,
            "nome": "string"
          }
        },
        "..."
      ]
    }
    ```

- `POST /professor/eventos`
  - descricao: Cria um novo evento, como prova ou atividade, para uma de suas turmas.
  - requerimentos: Autenticação: Sim | Acessível por: Professor
  - corpo da requisicao:
    ```json
    {
      "titulo": "string",
      "descricao": "string",
      "data_evento": "string",
      "valor_nota": 10,
      "tipo_evento": "PROVA | ATIVIDADE | GERAL",
      "turma_id": 1,
      "disciplina_id": 1
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 201,
      "sucesso": true,
      "mensagem": "Evento criado com sucesso.",
      "dados": {
        "id": 1,
        "turma_id": 1,
        "disciplina_id": 1,
        "criador_id": 1,
        "titulo": "string",
        "descricao": "string",
        "tipo_evento": "PROVA",
        "valor_nota": 10,
        "data_evento": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `GET /professor/eventos/proximos`
  - descricao: Busca os próximos eventos marcados para o professor.
  - requerimentos: Autenticação: Sim | Acessível por: Professor
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": [
        {
          "id": 1,
          "turma_id": 1,
          "disciplina_id": 1,
          "criador_id": 1,
          "titulo": "string",
          "descricao": "string",
          "tipo_evento": "PROVA",
          "valor_nota": 10,
          "data_evento": "string",
          "created_at": "string",
          "updated_at": "string",
          "turma": {
            "id": 1,
            "identificacao": "string",
            "serie": 1,
            "nivel_ensino": "MEDIO"
          },
          "disciplina": {
            "id": 1,
            "nome": "string"
          }
        },
        "..."
      ]
    }
    ```

- `GET /professor/eventos/:id/notas`
  - descricao: Busca o diário de notas de um evento específico criado pelo professor.
  - requerimentos: Autenticação: Sim | Acessível por: Professor
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": [
        {
          "id": 1,
          "nota": 10,
          "evento_id": 1,
          "matricula_id": 1,
          "created_at": "string",
          "updated_at": "string",
          "matricula": {
            "id": 1,
            "aluno": {
              "id": 1,
              "usuario": {
                "id": 1,
                "nome": "string"
              }
            }
          }
        },
        "..."
      ]
    }
    ```

---

### Turmas

- `POST /turmas`
  - descricao: Cria uma nova turma.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "identificacao": "string",
      "serie": 1,
      "nivel_ensino": "FUNDAMENTAL_1 | FUNDAMENTAL_2 | MEDIO",
      "sala": "string",
      "ano_letivo": 2026
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 201,
      "sucesso": true,
      "mensagem": "Turma criada com sucesso.",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "EM_ANDAMENTO",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `GET /turmas`
  - descricao: Busca todas as turmas de forma paginada.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "dados": [
          {
            "id": 1,
            "identificacao": "string",
            "serie": 1,
            "nivel_ensino": "MEDIO",
            "sala": "string",
            "ano_letivo": 2026,
            "situacao": "EM_ANDAMENTO",
            "deleted_at": null,
            "created_at": "string",
            "updated_at": "string"
          },
          "..."
        ],
        "meta": {
          "total": 1,
          "pagina": 1,
          "limite": 10,
          "ultima_pagina": 1
        }
      }
    }
    ```

- `GET /turmas/:id`
  - descricao: Busca uma turma pelo ID.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Operação realizada com sucesso",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "EM_ANDAMENTO",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /turmas/:id`
  - descricao: Atualiza dados de uma turma.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao:
    ```json
    {
      "identificacao": "string",
      "serie": 1,
      "nivel_ensino": "FUNDAMENTAL_1 | FUNDAMENTAL_2 | MEDIO",
      "sala": "string",
      "ano_letivo": 2026
    }
    ```
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Turma atualizada com sucesso.",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "EM_ANDAMENTO",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /turmas/:id/inativar`
  - descricao: Inativa (soft delete) uma turma.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Turma inativada com sucesso.",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "EM_ANDAMENTO",
        "deleted_at": "string",
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /turmas/:id/ativar`
  - descricao: Ativa uma turma inativada.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Turma ativada com sucesso.",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "EM_ANDAMENTO",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

- `PATCH /turmas/:id/encerrar`
  - descricao: Encerra uma turma (ano letivo). Altera a situação da turma para ENCERRADA, calcula a aprovação/reprovação de cada aluno com base em notas e frequência, e atualiza os rendimentos e matrículas. Regras de classificação por disciplina: nota >= 60 e freq >= 75% = APROVADO; nota < 60 e freq >= 75% = REPROVADO_POR_NOTA; nota >= 60 e freq < 75% = REPROVADO_POR_FALTA; nota < 60 e freq < 75% = REPROVADO_POR_FALTA.
  - requerimentos: Autenticação: Sim | Acessível por: Administrador
  - corpo da requisicao: Nenhum.
  - resposta de sucesso:
    ```json
    {
      "status": 200,
      "sucesso": true,
      "mensagem": "Turma encerrada com sucesso.",
      "dados": {
        "id": 1,
        "identificacao": "string",
        "serie": 1,
        "nivel_ensino": "MEDIO",
        "sala": "string",
        "ano_letivo": 2026,
        "situacao": "ENCERRADA",
        "deleted_at": null,
        "created_at": "string",
        "updated_at": "string"
      }
    }
    ```

---

## Observação

Ao criar uma nova rota, atualize este README, seguindo o mesmo padrão das rotas já existentes.
