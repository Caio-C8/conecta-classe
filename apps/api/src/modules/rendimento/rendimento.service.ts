import { Injectable, NotFoundException } from "@nestjs/common";
import { RendimentoRepository } from "./rendimento.repository";
import { MatriculaService } from "../matricula/matricula.service";
import { EventoService } from "../evento/evento.service";
import { RespostaGetRendimentosAluno } from "@repo/types";

@Injectable()
export class RendimentoService {
  constructor(
    private readonly rendimentoRepository: RendimentoRepository,
    private readonly matriculaService: MatriculaService,
    private readonly eventoService: EventoService,
  ) {}

  async getRendimentosPorAluno(
    usuarioId: number,
    anoLetivo: number,
  ): Promise<RespostaGetRendimentosAluno> {
    const matricula = await this.matriculaService.getMatriculaPorAluno(
      usuarioId,
      anoLetivo,
    );

    if (!matricula) {
      throw new NotFoundException(
        "Matrícula não encontrada para este aluno e ano letivo.",
      );
    }

    const [rendimentos, notasEventos] = await Promise.all([
      this.rendimentoRepository.findRendimentosPorMatricula(matricula.id),
      this.eventoService.getNotasEventosPorMatricula(matricula.id),
    ]);

    let totalNotas: number = 0;

    const rendimentosFormatados = rendimentos.map((rendimento) => {
      const eventosDaDisciplina = notasEventos
        .filter(
          (nota) => nota.evento?.disciplina_id === rendimento.disciplina_id,
        )
        .map((nota) => ({
          id: nota.evento_id,
          titulo: nota.evento?.titulo || null,
          tipo_evento: nota.evento?.tipo_evento || null,
          data_evento: nota.evento?.data_evento || null,
          nota_obtida: nota.nota_obtida,
          valor_nota: nota.evento?.valor_nota || null,
        }));

      totalNotas += rendimento.nota_total;

      return {
        disciplina: {
          id: rendimento.disciplina?.id || null,
          nome: rendimento.disciplina?.nome || null,
        },
        nota_total: rendimento.nota_total,
        situacao: rendimento.situacao,
        eventos: eventosDaDisciplina,
      };
    });

    const mediaGeral =
      rendimentos.length > 0
        ? Number((totalNotas / rendimentos.length).toFixed(2))
        : 0;

    return {
      usuario_id: usuarioId,
      ano_letivo: anoLetivo,
      turma: {
        identificacao: matricula.turma?.identificacao || null,
        serie: matricula.turma?.serie || null,
        nivel_ensino: matricula.turma?.nivel_ensino || null,
      },
      media_geral: mediaGeral,
      rendimentos: rendimentosFormatados,
    };
  }
}
