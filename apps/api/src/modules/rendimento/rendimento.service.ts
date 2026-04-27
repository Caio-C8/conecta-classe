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

    const rendimentosFormatados = rendimentos.map((rendimento) => {
      const eventosDaDisciplina = notasEventos
        .filter(
          (nota) => nota.evento?.disciplina_id === rendimento.disciplina_id,
        )
        .map((nota) => ({
          id: nota.evento_id,
          titulo: nota.evento?.titulo || null,
          tipo_evento: nota.evento?.tipo_evento || null,
          nota_obtida: nota.nota_obtida,
          valor_nota: nota.evento?.valor_nota || null,
        }));

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

    return {
      usuario_id: usuarioId,
      ano_letivo: anoLetivo,
      turma: {
        identificacao: matricula.turma?.identificacao || null,
        serie: matricula.turma?.serie || null,
        nivel_ensino: matricula.turma?.nivel_ensino || null,
      },
      rendimentos: rendimentosFormatados,
    };
  }
}

const teste = {
  status: 200,
  sucesso: true,
  mensagem: "Operação realizada com sucesso",
  dados: {
    usuario_id: 17,
    ano_letivo: 2026,
    turma: {
      identificacao: "B",
      serie: 9,
      nivel_ensino: "FUNDAMENTAL_2",
    },
    rendimentos: [
      {
        disciplina: {
          id: 9,
          nome: "História",
        },
        nota_total: 12.5,
        situacao: "CURSANDO",
        eventos: [
          {
            id: 4,
            titulo: "Prova Bimestral - Revolução Francesa",
            tipo_evento: "PROVA",
            nota_obtida: 8.5,
            valor_nota: 10,
          },
          {
            id: 5,
            titulo: "Trabalho em Grupo",
            tipo_evento: "ATIVIDADE",
            nota_obtida: 4,
            valor_nota: 5,
          },
        ],
      },
      {
        disciplina: {
          id: 10,
          nome: "Geografia",
        },
        nota_total: 9,
        situacao: "CURSANDO",
        eventos: [
          {
            id: 6,
            titulo: "Seminário - Geopolítica",
            tipo_evento: "ATIVIDADE",
            nota_obtida: 9,
            valor_nota: 10,
          },
        ],
      },
    ],
  },
};
