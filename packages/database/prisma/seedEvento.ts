import {
  PrismaClient,
  NivelEnsino,
  Papel,
  SituacaoTurma,
  StatusMatricula,
  TipoEvento,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando dados anteriores...");

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

  console.log("🌱 Iniciando o seed de Eventos...");

  // 1. Criar as Disciplinas
  const matematica = await prisma.disciplina.create({
    data: { nome: "Matemática" },
  });

  const biologia = await prisma.disciplina.create({
    data: { nome: "Biologia" },
  });

  // 2. Criar os Usuários (1 Aluno e 1 Professor)
  const senhaHash = await bcrypt.hash("Senha123@", 10);

  const aluno = await prisma.aluno.create({
    data: {
      usuario: {
        create: {
          usuario: "lucas.calendario",
          senha: senhaHash,
          nome: "Lucas Calendário",
          nome_search: "lucas calendario",
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
          usuario: "prof.roberto",
          senha: senhaHash,
          nome: "Roberto Professor",
          nome_search: "roberto professor",
          papel: Papel.PROFESSOR,
          trocar_senha: false,
        },
      },
    },
  });

  // 3. Criar a Turma
  const turma = await prisma.turma.create({
    data: {
      identificacao: "A",
      serie: 2, // 2º Ano do Ensino Médio
      nivel_ensino: NivelEnsino.MEDIO,
      sala: "Sala 201",
      ano_letivo: 2026,
      situacao: SituacaoTurma.EM_ANDAMENTO,
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
        disciplina_id: biologia.id,
      },
    ],
  });

  // 5. Matricular o Aluno na Turma (Ano 2026)
  await prisma.matricula.create({
    data: {
      aluno_id: aluno.id,
      turma_id: turma.id,
      ano_letivo: 2026,
      status: StatusMatricula.CURSANDO,
    },
  });

  // 6. Criar os Eventos para o Calendário
  // Vamos criar eventos espalhados no mês atual para aparecerem bonitos no seu Shadcn Calendar
  const hoje = new Date();

  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const semanaQueVem = new Date(hoje);
  semanaQueVem.setDate(hoje.getDate() + 7);

  const mesQueVem = new Date(hoje);
  mesQueVem.setMonth(hoje.getMonth() + 1);

  await prisma.evento.createMany({
    data: [
      {
        turma_id: turma.id,
        disciplina_id: matematica.id,
        criador_id: professor.id,
        titulo: "Prova Bimestral de Exatas",
        descricao: "Cairá todo o conteúdo sobre Geometria Analítica.",
        tipo_evento: TipoEvento.PROVA,
        valor_nota: 10.0,
        data_evento: amanha,
      },
      {
        turma_id: turma.id,
        disciplina_id: biologia.id,
        criador_id: professor.id,
        titulo: "Entrega do Trabalho",
        descricao: "Maquete sobre divisão celular.",
        tipo_evento: TipoEvento.ATIVIDADE,
        valor_nota: 5.0,
        data_evento: semanaQueVem,
      },
      {
        turma_id: turma.id,
        disciplina_id: biologia.id, // Mesmo sendo geral, o schema exige uma disciplina
        criador_id: professor.id,
        titulo: "Feira de Ciências",
        descricao: "Apresentação obrigatória no pátio principal.",
        tipo_evento: TipoEvento.GERAL,
        valor_nota: null, // Sem valor de nota
        data_evento: mesQueVem,
      },
    ],
  });

  console.log("✅ Seed finalizado com sucesso!");
  console.log("--------------------------------------------------");
  console.log(`📌 DADOS PARA TESTAR A ROTA DE EVENTOS:`);
  console.log(`   Usuário (Login): lucas.calendario`);
  console.log(`   Senha: Senha123@`);
  console.log(`   ID do Usuário (Se for mockar no token): ${aluno.usuario_id}`);
  console.log(`   Ano Letivo da URL: 2026`);
  console.log(`   Endpoint: GET /eventos/me/2026`);
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
