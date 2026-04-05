# Conecta Classe

Repositório do projeto **Conecta Classe**. Este projeto é estruturado como um monorepo (utilizando [Turborepo](https://turbo.build/)) contendo uma aplicação frontend em Next.js e uma API backend em NestJS, suportadas por pacotes compartilhados.

## 📁 Estrutura do Projeto

O projeto está dividido em `apps` (aplicações prontas para uso) e `packages` (bibliotecas internas utilizadas pelas aplicações).

### Aplicativos (`/apps`)

- **`api`**: Backend do sistema, construído com [NestJS](https://nestjs.com/) (verifique o README em `apps/api/README.md`).
- **`web`**: Frontend do projeto, desenvolvido com [Next.js](https://nextjs.org/) (App Router).

### Pacotes Compartilhados (`/packages`)

- **`database`**: Gerencia a conexão com o banco de dados via [Prisma ORM](https://www.prisma.io/). Contém o Prisma Schema, tipagens geradas do prisma client e scripts referentes à manipulação de schema.
- **`types`**: Definições de tipos TypeScript unificados (ex. `Aluno`, `Usuario`, `Papel`). Mantém a consistência entre o que o backend retorna e o que o frontend espera.
- **`utils`**: Funções utilitárias e lógicas que não dependem de uma aplicação específica (como tratamentos de string ou CPF).
- **`config`**: Configurações transversais (como ESLint, tsconfig, etc.) para padronizar o código pelo repositório.

---

## 🚀 Como Executar Localmente (Desenvolvimento)

### 1. Pré-Requisitos

- [Node.js](https://nodejs.org/).
- [pnpm](https://pnpm.io/) configurado como gerenciador de pacotes. (Pode ser instalado com o comando `npm install -g pnpm`)
- [Docker](https://www.docker.com/), necessário para rodar o banco de dados localmente atráves do `docker-compose.yml`.

### 2. Instalação das dependências

Acesse a raiz do projeto e instale todos os pacotes das aplicações:

```bash
pnpm install
```

### 3. Configuração das Variáveis de Ambiente (.env)

Antes de executar qualquer comando ou iniciar o banco de dados de desenvolvimento, **é estritamente necessário criar os seus arquivos `.env`**.

O repositório disponibiliza templates no formato `.env.example`. Siga estes passos:

1. **Na pasta raiz do projeto (`/`)**: Faça uma cópia do `.env.example`, renomeie a cópia para `.env` e defina as variáveis gerais ali descritas.
2. **Na pasta específica do banco de dados (`packages/database`)**: Faça uma cópia do `packages/database/.env.example`, renomeie-a para `packages/database/.env` e configure principalmente a variável `DATABASE_URL` (chave de conexão do Prisma).

### 4. Subir e Configurar o Banco de Dados

Inicialize o serviço do banco local na raiz:

```bash
docker-compose up -d
```

Após o banco estar rodando e os arquivos `.env` estarem no lugar, sincronize seu schema executando na raiz do projeto:

```bash
pnpm db:generate   # Constrói o Prisma Client localmente
pnpm db:push       # Envia as tabelas e os schemas do Prisma para o seu Banco de Dados
pnpm db:seed       # Executa o seed para criar o usuário administrador
```

### 5. Iniciar os Servidores

Feito tudo isto, basta ligar as aplicações simultaneamente utilizando o comando atrelado ao Turborepo. Na raiz do projeto, digite:

```bash
pnpm dev
```

Este comando executará simultaneamente as aplicaçãoes da API em [http://localhost:3001](http://localhost:3001) e do Web em [http://localhost:3000](http://localhost:3000).

---

## 💻 Scritps Adicionais

Outros comandos úteis:

- `pnpm run db:studio`: Inicia a interface administrativa do seu banco de dados (Prisma Studio) no navegador local.
- `docker-compose down`: Para o banco de dados local.
