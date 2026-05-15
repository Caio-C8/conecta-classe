import "dotenv/config";
import {
  Papel,
  PrismaClient,
  NivelEnsino,
  SituacaoTurma,
  StatusMatricula,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.notaEvento.deleteMany();
  await prisma.frequencia.deleteMany();
  await prisma.rendimentoDisciplina.deleteMany();

  await prisma.evento.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.professorTurma.deleteMany();

  await prisma.turma.deleteMany();
  await prisma.disciplina.deleteMany();

  await prisma.usuario.deleteMany();

  const senhaPadrao = await bcrypt.hash("Senha123@", 10);

  console.log("1. Garantindo Professor Teste...");
  const usuarioProfessor = await prisma.usuario.upsert({
    where: { usuario: "prof.teste" },
    update: {},
    create: {
      usuario: "prof.teste",
      senha: senhaPadrao,
      nome: "Professor Teste",
      nome_search: "professor teste",
      papel: Papel.PROFESSOR,
      trocar_senha: false,
      professor: { create: {} },
    },
    include: { professor: true },
  });

  console.log("2. Garantindo Disciplina (Geografia)...");
  let disciplina = await prisma.disciplina.findFirst({
    where: { nome: "Geografia" },
  });
  if (!disciplina) {
    disciplina = await prisma.disciplina.create({
      data: { nome: "Geografia", nome_search: "geografia" },
    });
  }

  console.log("3. Garantindo Turma Única (8º Ano A - 2026)...");
  let turma = await prisma.turma.findFirst({
    where: { identificacao: "A", serie: 8, ano_letivo: 2026 },
  });

  if (!turma) {
    turma = await prisma.turma.create({
      data: {
        identificacao: "A",
        serie: 8,
        nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
        sala: "Sala 04",
        ano_letivo: 2026,
        situacao: SituacaoTurma.EM_ANDAMENTO,
      },
    });
  }

  console.log("4. Vinculando Professor à Turma...");
  const vinculoExistente = await prisma.professorTurma.findFirst({
    where: {
      professor_id: usuarioProfessor.professor!.id,
      turma_id: turma.id,
      disciplina_id: disciplina.id,
    },
  });

  if (!vinculoExistente) {
    await prisma.professorTurma.create({
      data: {
        professor_id: usuarioProfessor.professor!.id,
        turma_id: turma.id,
        disciplina_id: disciplina.id,
      },
    });
  }

  const matricularAluno = async (usuario: string, nome: string) => {
    const user = await prisma.usuario.upsert({
      where: { usuario },
      update: {},
      create: {
        usuario,
        senha: senhaPadrao,
        nome,
        nome_search: nome.toLowerCase(),
        papel: Papel.ALUNO,
        trocar_senha: false,
        aluno: { create: {} },
      },
      include: { aluno: true },
    });

    const matriculaExistente = await prisma.matricula.findFirst({
      where: { aluno_id: user.aluno!.id, turma_id: turma.id },
    });

    if (!matriculaExistente) {
      await prisma.matricula.create({
        data: {
          aluno_id: user.aluno!.id,
          turma_id: turma.id,
          ano_letivo: 2026,
          status: StatusMatricula.CURSANDO,
        },
      });
    }
    return user;
  };

  console.log("5. Sincronizando Alunos...");
  await matricularAluno("aluno.teste", "Aluno Teste");
  await matricularAluno("aluno.maria", "Maria Silva");
  await matricularAluno("aluno.pedro", "Pedro Souza");

  console.log("Seed do Professor executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
