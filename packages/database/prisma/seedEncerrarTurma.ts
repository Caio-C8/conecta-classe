import {
  PrismaClient,
  NivelEnsino,
  Papel,
  Cargo,
  TipoEvento,
  SituacaoRendimento,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpando o banco de dados...");
  // Limpa todas as tabelas e reinicia os IDs (Apenas para PostgreSQL)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE usuarios, administradores, professores, alunos, disciplinas, turmas, professores_turmas, matriculas, aulas, frequencias, eventos, notas_eventos, rendimentos_disciplinas RESTART IDENTITY CASCADE;
  `);

  console.log("Banco limpo! Iniciando Seed...");

  // Senha padrão para todos
  const senhaHash = await bcrypt.hash("Senha123@", 10);
  const anoLetivo = 2026;

  // ==========================================
  // 1. CRIAR ADMINISTRADOR
  // ==========================================
  console.log("Criando Administrador...");
  const adminUser = await prisma.usuario.create({
    data: {
      usuario: "admin",
      senha: senhaHash,
      nome: "Administrador Principal",
      nome_search: "administrador principal",
      trocar_senha: false,
      papel: Papel.ADMINISTRADOR,
      administrador: {
        create: {
          cargo: Cargo.DIRETORA,
        },
      },
    },
  });

  // ==========================================
  // 2. CRIAR DISCIPLINAS E PROFESSORES
  // ==========================================
  console.log("Criando Disciplinas e Professores...");
  const disciplinaMat = await prisma.disciplina.create({
    data: { nome: "Matemática", nome_search: "matematica" },
  });
  const disciplinaPort = await prisma.disciplina.create({
    data: { nome: "Português", nome_search: "portugues" },
  });

  const profMat = await prisma.usuario.create({
    data: {
      usuario: "prof.mat",
      senha: senhaHash,
      nome: "Professor de Matemática",
      nome_search: "professor de matematica",
      trocar_senha: false,
      papel: Papel.PROFESSOR,
      professor: { create: {} },
    },
    include: { professor: true },
  });

  const profPort = await prisma.usuario.create({
    data: {
      usuario: "prof.port",
      senha: senhaHash,
      nome: "Professor de Português",
      nome_search: "professor de portugues",
      trocar_senha: false,
      papel: Papel.PROFESSOR,
      professor: { create: {} },
    },
    include: { professor: true },
  });

  // ==========================================
  // 3. CRIAR TURMAS
  // ==========================================
  console.log("Criando Turmas...");
  const turmaF1 = await prisma.turma.create({
    data: {
      identificacao: "A",
      serie: 5,
      nivel_ensino: NivelEnsino.FUNDAMENTAL_1,
      sala: "Sala 01",
      ano_letivo: anoLetivo,
    },
  });

  const turmaMedio = await prisma.turma.create({
    data: {
      identificacao: "B",
      serie: 1,
      nivel_ensino: NivelEnsino.MEDIO,
      sala: "Sala 02",
      ano_letivo: anoLetivo,
    },
  });

  // Vincular Professores às Turmas
  await prisma.professorTurma.createMany({
    data: [
      {
        professor_id: profMat.professor!.id,
        turma_id: turmaF1.id,
        disciplina_id: disciplinaMat.id,
      },
      {
        professor_id: profPort.professor!.id,
        turma_id: turmaF1.id,
        disciplina_id: disciplinaPort.id,
      },
      {
        professor_id: profMat.professor!.id,
        turma_id: turmaMedio.id,
        disciplina_id: disciplinaMat.id,
      },
      {
        professor_id: profPort.professor!.id,
        turma_id: turmaMedio.id,
        disciplina_id: disciplinaPort.id,
      },
    ],
  });

  // ==========================================
  // 4. CRIAR AULAS E EVENTOS
  // ==========================================
  console.log("Criando Aulas e Eventos (Provas)...");

  // Turma F1 (40 aulas globais) - vamos dividir 20 e 20 para ter registro, mas o Fundamental 1 olha o bolo todo
  const aulaF1Mat = await prisma.aula.create({
    data: {
      turma_id: turmaF1.id,
      disciplina_id: disciplinaMat.id,
      professor_id: profMat.professor!.id,
      data_aula: new Date(),
      quantidade: 20,
    },
  });
  const aulaF1Port = await prisma.aula.create({
    data: {
      turma_id: turmaF1.id,
      disciplina_id: disciplinaPort.id,
      professor_id: profPort.professor!.id,
      data_aula: new Date(),
      quantidade: 20,
    },
  });

  // Turma Médio (20 aulas de mat, 20 aulas de port)
  const aulaMedioMat = await prisma.aula.create({
    data: {
      turma_id: turmaMedio.id,
      disciplina_id: disciplinaMat.id,
      professor_id: profMat.professor!.id,
      data_aula: new Date(),
      quantidade: 20,
    },
  });
  const aulaMedioPort = await prisma.aula.create({
    data: {
      turma_id: turmaMedio.id,
      disciplina_id: disciplinaPort.id,
      professor_id: profPort.professor!.id,
      data_aula: new Date(),
      quantidade: 20,
    },
  });

  // Eventos de Avaliação (Provas valendo 100)
  const eventoF1Mat = await prisma.evento.create({
    data: {
      turma_id: turmaF1.id,
      disciplina_id: disciplinaMat.id,
      criador_id: profMat.professor!.id,
      titulo: "Prova Final F1 Mat",
      descricao: "Prova",
      tipo_evento: TipoEvento.PROVA,
      valor_nota: 100,
      data_evento: new Date(),
    },
  });
  const eventoF1Port = await prisma.evento.create({
    data: {
      turma_id: turmaF1.id,
      disciplina_id: disciplinaPort.id,
      criador_id: profPort.professor!.id,
      titulo: "Prova Final F1 Port",
      descricao: "Prova",
      tipo_evento: TipoEvento.PROVA,
      valor_nota: 100,
      data_evento: new Date(),
    },
  });

  const eventoMedioMat = await prisma.evento.create({
    data: {
      turma_id: turmaMedio.id,
      disciplina_id: disciplinaMat.id,
      criador_id: profMat.professor!.id,
      titulo: "Prova Final Médio Mat",
      descricao: "Prova",
      tipo_evento: TipoEvento.PROVA,
      valor_nota: 100,
      data_evento: new Date(),
    },
  });
  const eventoMedioPort = await prisma.evento.create({
    data: {
      turma_id: turmaMedio.id,
      disciplina_id: disciplinaPort.id,
      criador_id: profPort.professor!.id,
      titulo: "Prova Final Médio Port",
      descricao: "Prova",
      tipo_evento: TipoEvento.PROVA,
      valor_nota: 100,
      data_evento: new Date(),
    },
  });

  // ==========================================
  // 5. CRIAR ALUNOS, MATRÍCULAS E RENDIMENTOS
  // ==========================================
  console.log("Criando Alunos e lançando notas/faltas...");

  // Helper para criar o aluno já com as regras setadas
  async function criarAlunoComRendimento(
    index: number,
    turma: any,
    prefixo: string, // 'f1' ou 'medio'
    cenario: string,
    notas: { mat: number; port: number },
    faltas: { mat: number; port: number },
    aulas: { matId: number; portId: number },
    eventos: { matId: number; portId: number },
  ) {
    const nome = `Aluno ${index} (${cenario})`;
    const usuario = `aluno${index}.${prefixo}`;

    // Cria Usuário e Aluno
    const user = await prisma.usuario.create({
      data: {
        usuario,
        senha: senhaHash,
        nome,
        nome_search: nome.toLowerCase(),
        trocar_senha: false,
        papel: Papel.ALUNO,
        aluno: { create: {} },
      },
      include: { aluno: true },
    });

    // Cria Matrícula
    const matricula = await prisma.matricula.create({
      data: {
        aluno_id: user.aluno!.id,
        turma_id: turma.id,
        ano_letivo: anoLetivo,
        status: "CURSANDO",
      },
    });

    // Rendimentos
    const rendMat = await prisma.rendimentoDisciplina.create({
      data: {
        matricula_id: matricula.id,
        disciplina_id: disciplinaMat.id,
        nota_total: notas.mat,
        situacao: SituacaoRendimento.CURSANDO,
      },
    });
    const rendPort = await prisma.rendimentoDisciplina.create({
      data: {
        matricula_id: matricula.id,
        disciplina_id: disciplinaPort.id,
        nota_total: notas.port,
        situacao: SituacaoRendimento.CURSANDO,
      },
    });

    // Frequências (AGORA SEM O IF - Registra sempre, mesmo sendo 0)
    await prisma.frequencia.create({
      data: {
        aula_id: aulas.matId,
        matricula_id: matricula.id,
        numero_faltas: faltas.mat,
      },
    });
    await prisma.frequencia.create({
      data: {
        aula_id: aulas.portId,
        matricula_id: matricula.id,
        numero_faltas: faltas.port,
      },
    });

    // Lançamento das Notas dos Eventos
    await prisma.notaEvento.create({
      data: {
        evento_id: eventos.matId,
        matricula_id: matricula.id,
        nota_obtida: notas.mat,
      },
    });
    await prisma.notaEvento.create({
      data: {
        evento_id: eventos.portId,
        matricula_id: matricula.id,
        nota_obtida: notas.port,
      },
    });
  }

  // CÁLCULOS FUNDAMENTAL 1 (Frequência Global: Total 40 aulas. Máximo 10 faltas para 75%)
  await criarAlunoComRendimento(
    1,
    turmaF1,
    "f1",
    "Aprovado",
    { mat: 85, port: 80 },
    { mat: 0, port: 0 },
    { matId: aulaF1Mat.id, portId: aulaF1Port.id },
    { matId: eventoF1Mat.id, portId: eventoF1Port.id },
  );
  await criarAlunoComRendimento(
    2,
    turmaF1,
    "f1",
    "Reprovado Nota",
    { mat: 40, port: 50 },
    { mat: 0, port: 0 },
    { matId: aulaF1Mat.id, portId: aulaF1Port.id },
    { matId: eventoF1Mat.id, portId: eventoF1Port.id },
  );
  await criarAlunoComRendimento(
    3,
    turmaF1,
    "f1",
    "Reprovado Falta",
    { mat: 90, port: 90 },
    { mat: 6, port: 6 },
    { matId: aulaF1Mat.id, portId: aulaF1Port.id },
    { matId: eventoF1Mat.id, portId: eventoF1Port.id },
  ); // 12 faltas totais (<75%)
  await criarAlunoComRendimento(
    4,
    turmaF1,
    "f1",
    "ReprovAmbos",
    { mat: 30, port: 40 },
    { mat: 10, port: 10 },
    { matId: aulaF1Mat.id, portId: aulaF1Port.id },
    { matId: eventoF1Mat.id, portId: eventoF1Port.id },
  );
  await criarAlunoComRendimento(
    5,
    turmaF1,
    "f1",
    "Aprovado Limite",
    { mat: 60, port: 60 },
    { mat: 5, port: 5 },
    { matId: aulaF1Mat.id, portId: aulaF1Port.id },
    { matId: eventoF1Mat.id, portId: eventoF1Port.id },
  ); // 10 faltas totais (Exatos 75%)

  // CÁLCULOS ENSINO MÉDIO (Frequência por Disciplina: Total 20 aulas por disc. Máximo 5 faltas para 75%)
  await criarAlunoComRendimento(
    6,
    turmaMedio,
    "medio",
    "Aprovado",
    { mat: 80, port: 80 },
    { mat: 0, port: 2 },
    { matId: aulaMedioMat.id, portId: aulaMedioPort.id },
    { matId: eventoMedioMat.id, portId: eventoMedioPort.id },
  );
  await criarAlunoComRendimento(
    7,
    turmaMedio,
    "medio",
    "Reprovado Nota",
    { mat: 40, port: 80 },
    { mat: 0, port: 0 },
    { matId: aulaMedioMat.id, portId: aulaMedioPort.id },
    { matId: eventoMedioMat.id, portId: eventoMedioPort.id },
  ); // Fica reprovado em Matemática
  await criarAlunoComRendimento(
    8,
    turmaMedio,
    "medio",
    "Reprovado Falta",
    { mat: 90, port: 90 },
    { mat: 6, port: 0 },
    { matId: aulaMedioMat.id, portId: aulaMedioPort.id },
    { matId: eventoMedioMat.id, portId: eventoMedioPort.id },
  ); // 6 faltas em Mat (<75%)
  await criarAlunoComRendimento(
    9,
    turmaMedio,
    "medio",
    "ReprovAmbos",
    { mat: 45, port: 90 },
    { mat: 8, port: 0 },
    { matId: aulaMedioMat.id, portId: aulaMedioPort.id },
    { matId: eventoMedioMat.id, portId: eventoMedioPort.id },
  ); // Fica reprovado em Mat por nota e falta
  await criarAlunoComRendimento(
    10,
    turmaMedio,
    "medio",
    "Aprovado Limite",
    { mat: 60, port: 60 },
    { mat: 5, port: 5 },
    { matId: aulaMedioMat.id, portId: aulaMedioPort.id },
    { matId: eventoMedioMat.id, portId: eventoMedioPort.id },
  ); // 5 faltas em cada (exatos 75%)

  console.log("Seed executado com sucesso!");
  console.log("--- Resumo de Logins (Senha padrão: Senha123@) ---");
  console.log("-> admin");
  console.log("-> prof.mat");
  console.log("-> prof.port");
  console.log("-> aluno1.f1 (Aprovado)");
  console.log("-> aluno2.f1 (Reprovado por nota)");
  console.log("-> aluno6.medio (Aprovado)");
  console.log("-> aluno7.medio (Reprovado por nota em matemática)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
