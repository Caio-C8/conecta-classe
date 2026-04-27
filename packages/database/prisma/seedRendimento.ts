import {
  PrismaClient,
  NivelEnsino,
  Papel,
  SituacaoTurma,
  StatusMatricula,
  TipoEvento,
  SituacaoRendimento,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando dados anteriores...");

  // Ordem reversa para evitar erros de Foreign Key
  await prisma.notaEvento.deleteMany();
  await prisma.rendimentoDisciplina.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.frequencia.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.professorTurma.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.disciplina.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("🌱 Iniciando o seed de Rendimentos/Notas...");

  // 1. Criar as Disciplinas
  const historia = await prisma.disciplina.create({
    data: { nome: "História" },
  });

  const geografia = await prisma.disciplina.create({
    data: { nome: "Geografia" },
  });

  // 2. Criar os Usuários
  const senhaHash = await bcrypt.hash("Senha123@", 10);

  const aluno = await prisma.aluno.create({
    data: {
      usuario: {
        create: {
          usuario: "ana.boletim",
          senha: senhaHash,
          nome: "Ana Beatriz Notas",
          nome_search: "ana beatriz notas",
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
          usuario: "prof.marcos",
          senha: senhaHash,
          nome: "Marcos Professor",
          nome_search: "marcos professor",
          papel: Papel.PROFESSOR,
          trocar_senha: false,
        },
      },
    },
  });

  // 3. Criar a Turma
  const turma = await prisma.turma.create({
    data: {
      identificacao: "B",
      serie: 9, // 9º Ano do Fundamental 2
      nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
      sala: "Sala 302",
      ano_letivo: 2026,
      situacao: SituacaoTurma.EM_ANDAMENTO,
    },
  });

  // 4. Vincular o Professor à Turma
  await prisma.professorTurma.createMany({
    data: [
      {
        professor_id: professor.id,
        turma_id: turma.id,
        disciplina_id: historia.id,
      },
      {
        professor_id: professor.id,
        turma_id: turma.id,
        disciplina_id: geografia.id,
      },
    ],
  });

  // 5. Matricular a Aluna
  const matricula = await prisma.matricula.create({
    data: {
      aluno_id: aluno.id,
      turma_id: turma.id,
      ano_letivo: 2026,
      status: StatusMatricula.CURSANDO,
    },
  });

  // 6. Criar os Eventos (As Avaliações)
  // Vamos criar 2 avaliações de História e 1 de Geografia
  const provaHistoria = await prisma.evento.create({
    data: {
      turma_id: turma.id,
      disciplina_id: historia.id,
      criador_id: professor.id,
      titulo: "Prova Bimestral - Revolução Francesa",
      descricao: "Avaliação escrita sem consulta.",
      tipo_evento: TipoEvento.PROVA,
      valor_nota: 10.0,
      data_evento: new Date("2026-03-15T10:00:00.000Z"),
    },
  });

  const trabalhoHistoria = await prisma.evento.create({
    data: {
      turma_id: turma.id,
      disciplina_id: historia.id,
      criador_id: professor.id,
      titulo: "Trabalho em Grupo",
      descricao: "Apresentação sobre Iluminismo.",
      tipo_evento: TipoEvento.ATIVIDADE,
      valor_nota: 5.0,
      data_evento: new Date("2026-04-02T10:00:00.000Z"),
    },
  });

  const provaGeografia = await prisma.evento.create({
    data: {
      turma_id: turma.id,
      disciplina_id: geografia.id,
      criador_id: professor.id,
      titulo: "Seminário - Geopolítica",
      descricao: "Apresentação de slides.",
      tipo_evento: TipoEvento.ATIVIDADE,
      valor_nota: 10.0,
      data_evento: new Date("2026-03-20T10:00:00.000Z"),
    },
  });

  // 7. Lançar as Notas da Aluna nesses Eventos (NotaEvento)
  await prisma.notaEvento.createMany({
    data: [
      {
        evento_id: provaHistoria.id,
        matricula_id: matricula.id,
        nota_obtida: 8.5, // Tirou 8.5 de 10
      },
      {
        evento_id: trabalhoHistoria.id,
        matricula_id: matricula.id,
        nota_obtida: 4.0, // Tirou 4 de 5
      },
      {
        evento_id: provaGeografia.id,
        matricula_id: matricula.id,
        nota_obtida: 9.0, // Tirou 9 de 10
      },
    ],
  });

  // 8. Lançar o Rendimento Total da Disciplina (RendimentoDisciplina)
  // O sistema consolida as notas totais aqui. História = 8.5 + 4.0 = 12.5. Geografia = 9.0.
  await prisma.rendimentoDisciplina.createMany({
    data: [
      {
        matricula_id: matricula.id,
        disciplina_id: historia.id,
        nota_total: 12.5,
        situacao: SituacaoRendimento.CURSANDO,
      },
      {
        matricula_id: matricula.id,
        disciplina_id: geografia.id,
        nota_total: 9.0,
        situacao: SituacaoRendimento.CURSANDO,
      },
    ],
  });

  console.log("✅ Seed finalizado com sucesso!");
  console.log("--------------------------------------------------");
  console.log(`📌 DADOS PARA TESTAR A ROTA DE RENDIMENTOS:`);
  console.log(`   Usuário (Login): ana.boletim`);
  console.log(`   Senha: Senha123@`);
  console.log(`   ID do Usuário (Mock no token): ${aluno.usuario_id}`);
  console.log(`   Ano Letivo da URL: 2026`);
  console.log(`   Endpoint: GET /rendimentos/me/2026`);
  console.log("--------------------------------------------------");
  console.log(`💡 O QUE VOCÊ DEVE VER NA RESPOSTA:`);
  console.log(
    `   - História com nota_total: 12.5 e 2 avaliações (8.5 e 4.0) no array.`,
  );
  console.log(
    `   - Geografia com nota_total: 9.0 e 1 avaliação (9.0) no array.`,
  );
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
