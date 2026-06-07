import {
  Cargo,
  NivelEnsino,
  Papel,
  PrismaClient,
  StatusMatricula,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Limpa todas as tabelas e reinicia os IDs
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE usuarios, administradores, professores, alunos, disciplinas, turmas, professores_turmas, matriculas, aulas, frequencias, eventos, notas_eventos, rendimentos_disciplinas RESTART IDENTITY CASCADE;
  `);

  const senhaPadrao = await bcrypt.hash("Senha123@", 10);

  // 1. Criar Administrador
  await prisma.usuario.create({
    data: {
      usuario: "adm",
      senha: senhaPadrao,
      nome: "Administrador",
      nome_search: "administrador",
      papel: Papel.ADMINISTRADOR,
      trocar_senha: false,
      administrador: {
        create: {
          cargo: Cargo.DIRETORA,
        },
      },
    },
  });

  // 2. Criar Professor
  const professorUser = await prisma.usuario.create({
    data: {
      usuario: "professor",
      senha: senhaPadrao,
      nome: "Carlos Eduardo",
      nome_search: "carlos eduardo",
      papel: Papel.PROFESSOR,
      trocar_senha: false,
      professor: {
        create: {}, // Cria o registro na tabela de professores
      },
    },
    include: {
      professor: true,
    },
  });

  // 3. Criar Disciplinas
  const matematica = await prisma.disciplina.create({
    data: { nome: "Matemática", nome_search: "matematica" },
  });

  const fisica = await prisma.disciplina.create({
    data: { nome: "Física", nome_search: "fisica" },
  });

  // 4. Criar Turmas
  const turma9A = await prisma.turma.create({
    data: {
      identificacao: "A",
      serie: 9,
      nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
      sala: "Sala 101",
      ano_letivo: 2026,
    },
  });

  const turma1B = await prisma.turma.create({
    data: {
      identificacao: "B",
      serie: 1,
      nivel_ensino: NivelEnsino.MEDIO,
      sala: "Sala 201",
      ano_letivo: 2026,
    },
  });

  // 5. Vincular o Professor às Turmas e Disciplinas
  await prisma.professorTurma.createMany({
    data: [
      {
        professor_id: professorUser.professor!.id,
        turma_id: turma9A.id,
        disciplina_id: matematica.id,
      },
      {
        professor_id: professorUser.professor!.id,
        turma_id: turma1B.id,
        disciplina_id: fisica.id,
      },
    ],
  });

  // 6. Criar Alunos e Matriculá-los nas Turmas
  const alunosMock = [
    { nome: "Ana Silva", user: "aluno.ana", turmaId: turma9A.id },
    { nome: "Bruno Souza", user: "aluno.bruno", turmaId: turma9A.id },
    { nome: "Clara Mendes", user: "aluno.clara", turmaId: turma1B.id },
    { nome: "Diego Costa", user: "aluno.diego", turmaId: turma1B.id },
  ];

  for (const aluno of alunosMock) {
    await prisma.usuario.create({
      data: {
        usuario: aluno.user,
        senha: senhaPadrao,
        nome: aluno.nome,
        nome_search: aluno.nome.toLowerCase().replace(" ", ""),
        papel: Papel.ALUNO,
        trocar_senha: false,
        aluno: {
          create: {
            matriculas: {
              create: {
                turma_id: aluno.turmaId,
                ano_letivo: 2026,
                status: StatusMatricula.CURSANDO,
              },
            },
          },
        },
      },
    });
  }

  console.log("✅ Seed executado com sucesso!");
  console.log("--------------------------------------------------");
  console.log("👨‍🏫 Credenciais para testar as rotas (Professor):");
  console.log("Usuário: professor");
  console.log("Senha:   Senha123@");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
