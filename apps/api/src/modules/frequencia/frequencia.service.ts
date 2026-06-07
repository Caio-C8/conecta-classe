import { Injectable, NotFoundException } from "@nestjs/common";
import { FrequenciaRepository } from "./frequencia.repository";
import { MatriculaService } from "../matricula/matricula.service";
import { AulaService } from "../aula/aula.service";
import { DisciplinaService } from "../disciplina/disciplina.service";
import { UsuarioService } from "../usuario/usuario.service";
import { NivelEnsino, RespostaGetFrequenciaAluno } from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class FrequenciaService {
  constructor(
    private readonly frequenciaRepository: FrequenciaRepository,
    private readonly matriculaService: MatriculaService,
    private readonly aulaService: AulaService,
    private readonly disciplinaService: DisciplinaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async getFrequenciaAluno(
    usuarioId: number,
    anoLetivo: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RespostaGetFrequenciaAluno> {
    const aluno = await this.usuarioService.getUsuarioPorId(usuarioId, tx);

    if (!aluno) {
      throw new NotFoundException("Aluno não encontrado.");
    }

    const matricula = await this.matriculaService.getMatriculaPorAluno(
      usuarioId,
      anoLetivo,
      tx,
    );

    if (!matricula) {
      throw new NotFoundException(
        "Matrícula não encontrada para este aluno e ano letivo.",
      );
    }

    const { turma } = matricula;

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.nivel_ensino === NivelEnsino.FUNDAMENTAL_1) {
      const totalAulas = await this.aulaService.getTotalAulasPorTurma(
        turma.id,
        tx,
      );

      const totalFaltas =
        await this.frequenciaRepository.sumNumeroFaltasByMatriculaId(
          matricula.id,
          tx,
        );

      const presencas = totalAulas > 0 ? totalAulas - totalFaltas : 0;
      const presencaPercentual =
        totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 100;

      return {
        usuario_id: usuarioId,
        ano_letivo: anoLetivo,
        visao: "GERAL",
        turma: {
          identificacao: turma.identificacao,
          serie: turma.serie,
          nivel_ensino: turma.nivel_ensino,
        },
        frequencia: {
          total_aulas: totalAulas,
          total_faltas: totalFaltas,
          presenca_percentual: presencaPercentual,
        },
      };
    } else {
      const disciplinas = await this.disciplinaService.getDisciplinasPorTurmas(
        turma.id,
        tx,
      );

      const aulasPorDisciplina =
        await this.aulaService.getAulasPorDisciplinaPorTurma(turma.id, tx);

      const faltas = await this.frequenciaRepository.findByMatriculaId(
        matricula.id,
        tx,
      );

      let totalAulas: number = 0;
      let totalFaltas: number = 0;

      const frequencias = disciplinas.map((disciplina) => {
        const agregacaoAulas = aulasPorDisciplina.find(
          (aula) => aula.disciplina_id === disciplina.id,
        );

        const aulasRealizadas = agregacaoAulas?._sum.quantidade || 0;

        const faltasNessaDisciplina = faltas
          .filter((falta) => falta.aula?.disciplina_id === disciplina.id)
          .reduce((acc, falta) => acc + falta.numero_faltas, 0);

        const presencas = Math.max(0, aulasRealizadas - faltasNessaDisciplina);

        const percentualPresenca =
          aulasRealizadas > 0
            ? Math.round((presencas / aulasRealizadas) * 100)
            : 100;

        totalAulas += aulasRealizadas;
        totalFaltas += faltasNessaDisciplina;

        return {
          disciplina: {
            id: disciplina.id,
            nome: disciplina.nome,
          },
          aulas_realizadas: aulasRealizadas,
          faltas: faltasNessaDisciplina,
          presenca_percentual: percentualPresenca,
        };
      });

      const presencas = Math.max(0, totalAulas - totalFaltas);
      const presencaPercentualGeral =
        totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 100;

      return {
        usuario_id: usuarioId,
        ano_letivo: anoLetivo,
        visao: "POR_DISCIPLINA",
        porcentagem_frequencia_geral: presencaPercentualGeral,
        total_faltas: totalFaltas,
        total_aulas: totalAulas,
        turma: {
          identificacao: turma.identificacao,
          serie: turma.serie,
          nivel_ensino: turma.nivel_ensino,
        },
        frequencias,
      };
    }
  }
}
