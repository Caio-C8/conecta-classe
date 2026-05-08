import "dotenv/config";
import { Papel, PrismaClient, NivelEnsino, SituacaoTurma, StatusMatricula } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaPadrao = await bcrypt.hash("Senha123@", 10);

  console.log("1. Invocando Professor Teste...");
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
    include: { professor: true }
  });

  console.log("2. Criando Disciplina (Geografia)...");
  // Procuramos Geografia, se não existir no banco, criamos.
  let disciplina = await prisma.disciplina.findFirst({ where: { nome: "Geografia" } });
  if (!disciplina) {
    disciplina = await prisma.disciplina.create({ data: { nome: "Geografia" } });
  }

  console.log("3. Criando Turma do Ensino Fundamental 2...");
  const turma = await prisma.turma.create({
    data: {
      identificacao: "A",
      serie: 8, // 8º Ano
      nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
      sala: "Sala 04",
      ano_letivo: 2026,
      situacao: SituacaoTurma.EM_ANDAMENTO,
    },
  });

  console.log("4. Vinculando Professor -> Turma -> Disciplina...");
  await prisma.professorTurma.create({
    data: {
      professor_id: usuarioProfessor.professor!.id,
      turma_id: turma.id,
      disciplina_id: disciplina.id,
    },
  });

  console.log("5. Matriculando um Aluno Teste na Turma...");
  const usuarioAluno = await prisma.usuario.upsert({
    where: { usuario: "aluno.teste" },
    update: {},
    create: {
      usuario: "aluno.teste",
      senha: senhaPadrao,
      nome: "Aluno Teste",
      nome_search: "aluno teste",
      papel: Papel.ALUNO,
      trocar_senha: false,
      aluno: { create: {} },
    },
    include: { aluno: true }
  });

  await prisma.matricula.create({
    data: {
      aluno_id: usuarioAluno.aluno!.id,
      turma_id: turma.id,
      ano_letivo: 2026,
      status: StatusMatricula.CURSANDO,
    },
  });

  console.log("✨ Seed do Professor executado com sucesso! ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });