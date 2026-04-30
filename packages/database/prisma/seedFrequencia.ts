import {
  PrismaClient,
  NivelEnsino,
  Papel,
  SituacaoTurma,
  StatusMatricula,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed...");

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

  // 1. Criar as Disciplinas
  const matematica = await prisma.disciplina.create({
    data: { nome: "Matemática" },
  });

  const fisica = await prisma.disciplina.create({
    data: { nome: "Física" },
  });

  // 2. Criar os Usuários junto com seus perfis (Aluno e Professor)
  const aluno = await prisma.aluno.create({
    data: {
      usuario: {
        create: {
          usuario: "joao.medio",
          senha: await bcrypt.hash("Senha123@", 10),
          nome: "João Pedro Silva",
          nome_search: "joao pedro silva",
          papel: Papel.ALUNO,
          trocar_senha: false,
        },
      },
    },
    include: { usuario: true },
  });

  const alunoFund1 = await prisma.aluno.create({
    data: {
      usuario: {
        create: {
          usuario: "mario.fund",
          senha: await bcrypt.hash("Senha123@", 10),
          nome: "Mario Fundamental",
          nome_search: "mario fundamental",
          papel: Papel.ALUNO,
          trocar_senha: false,
        },
      },
    },
    include: { usuario: true },
  });

  const alunoAntigo = await prisma.aluno.create({
    data: {
      usuario: {
        create: {
          usuario: "ana.antiga",
          senha: await bcrypt.hash("Senha123@", 10),
          nome: "Ana Clara",
          nome_search: "ana clara",
          papel: Papel.ALUNO,
          trocar_senha: false,
        },
      },
    },
    include: { usuario: true },
  });

  const professor = await prisma.professor.create({
    data: {
      usuario: {
        create: {
          usuario: "carlos.prof",
          senha: await bcrypt.hash("Senha123@", 10),
          nome: "Carlos Eduardo",
          nome_search: "carlos eduardo",
          papel: Papel.PROFESSOR,
        },
      },
    },
  });

  // 3. Criar as Turmas
  const turma = await prisma.turma.create({
    data: {
      identificacao: "A",
      serie: 1, // 1º Ano do Ensino Médio
      nivel_ensino: NivelEnsino.MEDIO,
      sala: "Sala 101",
      ano_letivo: 2026,
      situacao: SituacaoTurma.EM_ANDAMENTO,
    },
  });

  const turmaFund1 = await prisma.turma.create({
    data: {
      identificacao: "B",
      serie: 2, // 2º Ano do Fundamental 1
      nivel_ensino: NivelEnsino.FUNDAMENTAL_1,
      sala: "Sala 102",
      ano_letivo: 2026,
      situacao: SituacaoTurma.EM_ANDAMENTO,
    },
  });

  const turmaAntiga = await prisma.turma.create({
    data: {
      identificacao: "C",
      serie: 9, // 9º Ano
      nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
      sala: "Sala 103",
      ano_letivo: 2025,
      situacao: SituacaoTurma.ENCERRADA,
    },
  });

  // 4. Vincular o Professor à Turma nas duas Disciplinas
  await prisma.professorTurma.createMany({
    data: [
      {
        professor_id: professor.id,
        turma_id: turma.id,
        disciplina_id: matematica.id,
      },
      {
        professor_id: professor.id,
        turma_id: turma.id,
        disciplina_id: fisica.id,
      },
      {
        professor_id: professor.id,
        turma_id: turmaAntiga.id,
        disciplina_id: matematica.id,
      },
    ],
  });

  // 5. Matricular os Alunos nas Turmas
  const matricula = await prisma.matricula.create({
    data: {
      aluno_id: aluno.id,
      turma_id: turma.id,
      ano_letivo: 2026,
      status: StatusMatricula.CURSANDO,
    },
  });

  const matriculaFund1 = await prisma.matricula.create({
    data: {
      aluno_id: alunoFund1.id,
      turma_id: turmaFund1.id,
      ano_letivo: 2026,
      status: StatusMatricula.CURSANDO,
    },
  });

  const matriculaAntiga = await prisma.matricula.create({
    data: {
      aluno_id: alunoAntigo.id,
      turma_id: turmaAntiga.id,
      ano_letivo: 2025,
      status: StatusMatricula.APROVADO,
    },
  });

  // 6. Criar algumas Aulas no passado (para caírem no filtro lte: hoje)
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);

  const anteontem = new Date();
  anteontem.setDate(anteontem.getDate() - 2);

  const dataAtrasada = new Date(2025, 10, 15); // Novembro de 2025

  const aulaMatematica = await prisma.aula.create({
    data: {
      turma_id: turma.id,
      disciplina_id: matematica.id,
      professor_id: professor.id,
      data_aula: ontem,
      quantidade: 2, // Aula dupla conforme o comentário abaixo
    },
  });

  const aulaFisica = await prisma.aula.create({
    data: {
      turma_id: turma.id,
      disciplina_id: fisica.id,
      professor_id: professor.id,
      data_aula: anteontem,
      quantidade: 1,
    },
  });

  const aulaFund1 = await prisma.aula.create({
    data: {
      turma_id: turmaFund1.id,
      disciplina_id: null, // Fundamental 1 pode não ter disciplina específica
      professor_id: professor.id,
      data_aula: ontem,
      quantidade: 2, // Teste com 2 aulas
    },
  });

  const aulaAntiga = await prisma.aula.create({
    data: {
      turma_id: turmaAntiga.id,
      disciplina_id: matematica.id,
      professor_id: professor.id,
      data_aula: dataAtrasada,
      quantidade: 1,
    },
  });

  // 7. Registrar a Frequência (Faltas)
  // Matemática: Teve 1 aula, o aluno faltou 2 vezes (ex: aula dupla)
  await prisma.frequencia.create({
    data: {
      aula_id: aulaMatematica.id,
      matricula_id: matricula.id,
      numero_faltas: 2,
    },
  });

  // Física: Teve 1 aula, o aluno teve 0 faltas (presença 100%)
  await prisma.frequencia.create({
    data: {
      aula_id: aulaFisica.id,
      matricula_id: matricula.id,
      numero_faltas: 0,
    },
  });

  // Fund 1:
  await prisma.frequencia.create({
    data: {
      aula_id: aulaFund1.id,
      matricula_id: matriculaFund1.id,
      numero_faltas: 1,
    },
  });

  // Antiga:
  await prisma.frequencia.create({
    data: {
      aula_id: aulaAntiga.id,
      matricula_id: matriculaAntiga.id,
      numero_faltas: 0,
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
  console.log("--------------------------------------------------");
  console.log(`📌 TESTE A ROTA COM:`);
  console.log(`   ID do Usuário (Médio): ${aluno.usuario_id} | Ano: 2026`);
  console.log(
    `   ID do Usuário (Fund 1): ${alunoFund1.usuario_id} | Ano: 2026`,
  );
  console.log(
    `   ID do Usuário (Antiga): ${alunoAntigo.usuario_id} | Ano: 2025`,
  );
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
