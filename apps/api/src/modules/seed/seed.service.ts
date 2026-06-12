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
    const disciplinaNomes = [
      "Matemática",
      "Português",
      "Ciências",
      "História",
      "Geografia",
    ];
    const disciplinas: any[] = [];
    for (const nome of disciplinaNomes) {
      const disciplina = await this.disciplinaService.createDisciplina({
        nome,
      });
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
      const professorDb = await this.prisma.professor.findFirst({
        where: { usuario_id: prof.id },
      });
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
      const alunoDb = await this.prisma.aluno.findFirst({
        where: { usuario_id: aluno.id },
      });
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
      disciplinaId: disciplinas[0].id, // Tanto faz a disciplina no Fund 1 para a turma em si
    });

    // Fundamental 2 (Prof. Ana e Marcos)
    await this.turmaService.vincularProfessor(turmaF2.id, {
      professorId: professores[1].id,
      disciplinaId: disciplinas[1].id, // Português
    });
    await this.turmaService.vincularProfessor(turmaF2.id, {
      professorId: professores[2].id,
      disciplinaId: disciplinas[2].id, // Ciências
    });

    // Médio (Prof. Carlos e Ana)
    await this.turmaService.vincularProfessor(turmaMedio.id, {
      professorId: professores[0].id,
      disciplinaId: disciplinas[0].id, // Matemática
    });
    await this.turmaService.vincularProfessor(turmaMedio.id, {
      professorId: professores[1].id,
      disciplinaId: disciplinas[3].id, // História
    });

    // Distribuir Alunos (7 na F1, 7 na F2, 6 no Médio)
    for (let i = 0; i < 7; i++) {
      await this.turmaService.vincularAluno(turmaF1.id, {
        alunoId: alunos[i].id,
      });
    }
    for (let i = 7; i < 14; i++) {
      await this.turmaService.vincularAluno(turmaF2.id, {
        alunoId: alunos[i].id,
      });
    }
    for (let i = 14; i < 20; i++) {
      await this.turmaService.vincularAluno(turmaMedio.id, {
        alunoId: alunos[i].id,
      });
    }
  }
}
