import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UsuarioService } from "../usuario/usuario.service";
import { TurmaService } from "../turma/turma.service";
import { DisciplinaService } from "../disciplina/disciplina.service";
import { NivelEnsino, Papel, Cargo, TipoEvento } from "@repo/types";

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioService: UsuarioService,
    private readonly turmaService: TurmaService,
    private readonly disciplinaService: DisciplinaService,
  ) {}

  async limparBanco(): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      TRUNCATE TABLE usuarios, administradores, professores, alunos, disciplinas, turmas, professores_turmas, matriculas, aulas, frequencias, eventos, notas_eventos, rendimentos_disciplinas RESTART IDENTITY CASCADE;
    `);

    await this.usuarioService.createUsuario({
      usuario: "adm",
      senha: "Senha123@",
      nome: "Administrador",
      papel: Papel.ADMINISTRADOR,
      cargo: Cargo.DIRETORA,
      trocar_senha: false,
    });
  }

  async popularBanco(): Promise<void> {
    // 1. Limpa o banco antes de popular
    await this.limparBanco();

    // 2. Cria Disciplinas
    const disciplinaNomes = ["Matemática", "Português", "Ciências", "História", "Geografia"];
    const disciplinas: any[] = [];
    for (const nome of disciplinaNomes) {
      const disciplina = await this.disciplinaService.createDisciplina({ nome });
      disciplinas.push(disciplina);
    }

    // 3. Cria Professores
    const professoresData = [
      { usuario: "prof.carlos", nome: "Carlos Almeida" },
      { usuario: "prof.ana", nome: "Ana Beatriz" },
      { usuario: "prof.marcos", nome: "Marcos Silva" },
    ];
    const professores: any[] = [];
    for (const p of professoresData) {
      const prof = await this.usuarioService.createUsuario({
        usuario: p.usuario,
        senha: "Senha123@",
        nome: p.nome,
        papel: Papel.PROFESSOR,
        trocar_senha: false,
      });
      // Pega o ID do professor para vínculo posterior
      const professorDb = await this.prisma.professor.findFirst({ where: { usuario_id: prof.id }});
      if (professorDb) professores.push(professorDb);
    }

    // 4. Cria Alunos
    const alunos: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const aluno = await this.usuarioService.createUsuario({
        usuario: `aluno${i}`,
        senha: "Senha123@",
        nome: `Aluno de Teste ${i}`,
        papel: Papel.ALUNO,
        trocar_senha: false,
      });
      const alunoDb = await this.prisma.aluno.findFirst({ where: { usuario_id: aluno.id }});
      if (alunoDb) alunos.push(alunoDb);
    }

    // 5. Cria Turmas
    const anoLetivo = new Date().getFullYear();

    const turmaF1 = await this.turmaService.create({
      identificacao: "Turma F1 A",
      serie: 3,
      nivel_ensino: NivelEnsino.FUNDAMENTAL_1,
      sala: "Sala 01",
      ano_letivo: anoLetivo,
    });

    const turmaF2 = await this.turmaService.create({
      identificacao: "Turma F2 B",
      serie: 7,
      nivel_ensino: NivelEnsino.FUNDAMENTAL_2,
      sala: "Sala 02",
      ano_letivo: anoLetivo,
    });

    const turmaMedio = await this.turmaService.create({
      identificacao: "Turma Médio C",
      serie: 1,
      nivel_ensino: NivelEnsino.MEDIO,
      sala: "Sala 03",
      ano_letivo: anoLetivo,
    });

    // 6. Vincula Professores e Alunos nas Turmas

    // Fundamental 1 (Prof. Carlos)
    await this.turmaService.vincularProfessor(turmaF1.id, {
      professorId: professores[0].id,
      disciplinaId: disciplinas[0].id // Tanto faz a disciplina no Fund 1 para a turma em si
    });

    // Fundamental 2 (Prof. Ana e Marcos)
    await this.turmaService.vincularProfessor(turmaF2.id, {
      professorId: professores[1].id,
      disciplinaId: disciplinas[1].id // Português
    });
    await this.turmaService.vincularProfessor(turmaF2.id, {
      professorId: professores[2].id,
      disciplinaId: disciplinas[2].id // Ciências
    });

    // Médio (Prof. Carlos e Ana)
    await this.turmaService.vincularProfessor(turmaMedio.id, {
      professorId: professores[0].id,
      disciplinaId: disciplinas[0].id // Matemática
    });
    await this.turmaService.vincularProfessor(turmaMedio.id, {
      professorId: professores[1].id,
      disciplinaId: disciplinas[3].id // História
    });

    // Distribuir Alunos (7 na F1, 7 na F2, 6 no Médio)
    for (let i = 0; i < 7; i++) {
      await this.turmaService.vincularAluno(turmaF1.id, { alunoId: alunos[i].id });
    }
    for (let i = 7; i < 14; i++) {
      await this.turmaService.vincularAluno(turmaF2.id, { alunoId: alunos[i].id });
    }
    for (let i = 14; i < 20; i++) {
      await this.turmaService.vincularAluno(turmaMedio.id, { alunoId: alunos[i].id });
    }

    // 7. Simular Resultados (Eventos, Notas, Aulas e Frequências)
    const matriculasF1 = await this.prisma.matricula.findMany({ where: { turma_id: turmaF1.id } });
    const matriculasF2 = await this.prisma.matricula.findMany({ where: { turma_id: turmaF2.id } });
    const matriculasMedio = await this.prisma.matricula.findMany({ where: { turma_id: turmaMedio.id } });

    const pastDate1 = new Date('2026-02-15T10:00:00Z');
    const pastDate2 = new Date('2026-04-10T10:00:00Z');

    // Turma F1 (Prof. Carlos, Matemática)
    const eventoAvaliativoF1 = await this.prisma.evento.create({
      data: {
        turma_id: turmaF1.id,
        disciplina_id: disciplinas[0].id,
        criador_id: professores[0].id,
        titulo: "Prova do 1º Bimestre",
        descricao: "Prova de Matemática Básica",
        tipo_evento: TipoEvento.PROVA,
        valor_nota: 10.0,
        data_evento: pastDate1,
      }
    });
    for (const m of matriculasF1) {
      await this.prisma.notaEvento.create({
        data: { evento_id: eventoAvaliativoF1.id, matricula_id: m.id, nota_obtida: 8.5 }
      });
      await this.prisma.rendimentoDisciplina.updateMany({
        where: { matricula_id: m.id, disciplina_id: disciplinas[0].id },
        data: { nota_total: 8.5 }
      });
    }

    await this.prisma.evento.create({
      data: {
        turma_id: turmaF1.id,
        disciplina_id: disciplinas[0].id,
        criador_id: professores[0].id,
        titulo: "Aviso de Reunião",
        descricao: "Reunião de Pais e Mestres",
        tipo_evento: TipoEvento.AVISO,
        data_evento: pastDate2,
      }
    });

    const aulaF1 = await this.prisma.aula.create({
      data: {
        turma_id: turmaF1.id,
        disciplina_id: disciplinas[0].id,
        professor_id: professores[0].id,
        data_aula: pastDate1,
        quantidade: 2,
      }
    });
    for (const m of matriculasF1) {
      await this.prisma.frequencia.create({
        data: { aula_id: aulaF1.id, matricula_id: m.id, numero_faltas: 0 }
      });
    }

    // Turma F2 (Prof. Ana, Português)
    const eventoAvaliativoF2 = await this.prisma.evento.create({
      data: {
        turma_id: turmaF2.id,
        disciplina_id: disciplinas[1].id,
        criador_id: professores[1].id,
        titulo: "Prova de Redação",
        descricao: "Avaliação do 1º Bimestre",
        tipo_evento: TipoEvento.PROVA,
        valor_nota: 10.0,
        data_evento: pastDate1,
      }
    });
    for (const m of matriculasF2) {
      await this.prisma.notaEvento.create({
        data: { evento_id: eventoAvaliativoF2.id, matricula_id: m.id, nota_obtida: 7.0 }
      });
      await this.prisma.rendimentoDisciplina.updateMany({
        where: { matricula_id: m.id, disciplina_id: disciplinas[1].id },
        data: { nota_total: 7.0 }
      });
    }

    const aulaF2 = await this.prisma.aula.create({
      data: {
        turma_id: turmaF2.id,
        disciplina_id: disciplinas[1].id,
        professor_id: professores[1].id,
        data_aula: pastDate1,
        quantidade: 2,
      }
    });
    for (const m of matriculasF2) {
      await this.prisma.frequencia.create({
        data: { aula_id: aulaF2.id, matricula_id: m.id, numero_faltas: 1 }
      });
    }

    // Turma Médio (Prof. Carlos, Matemática)
    const eventoAvaliativoMedio = await this.prisma.evento.create({
      data: {
        turma_id: turmaMedio.id,
        disciplina_id: disciplinas[0].id,
        criador_id: professores[0].id,
        titulo: "Prova de Álgebra",
        descricao: "Funções e Equações",
        tipo_evento: TipoEvento.PROVA,
        valor_nota: 10.0,
        data_evento: pastDate2,
      }
    });
    for (const m of matriculasMedio) {
      await this.prisma.notaEvento.create({
        data: { evento_id: eventoAvaliativoMedio.id, matricula_id: m.id, nota_obtida: 9.0 }
      });
      await this.prisma.rendimentoDisciplina.updateMany({
        where: { matricula_id: m.id, disciplina_id: disciplinas[0].id },
        data: { nota_total: 9.0 }
      });
    }

    const aulaMedio = await this.prisma.aula.create({
      data: {
        turma_id: turmaMedio.id,
        disciplina_id: disciplinas[0].id,
        professor_id: professores[0].id,
        data_aula: pastDate2,
        quantidade: 2,
      }
    });
    for (const m of matriculasMedio) {
      await this.prisma.frequencia.create({
        data: { aula_id: aulaMedio.id, matricula_id: m.id, numero_faltas: 0 }
      });
    }
  }
}
