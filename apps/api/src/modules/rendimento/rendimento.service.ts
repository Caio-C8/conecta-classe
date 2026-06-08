import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RendimentoRepository } from "./rendimento.repository";
import { MatriculaService } from "../matricula/matricula.service";
import { EventoService } from "../evento/evento.service";
import {
  RendimentoDisciplina,
  RespostaGetRendimentosAluno,
  SituacaoRendimento,
} from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class RendimentoService {
  constructor(
    private readonly rendimentoRepository: RendimentoRepository,
    @Inject(forwardRef(() => MatriculaService))
    private readonly matriculaService: MatriculaService,
    @Inject(forwardRef(() => EventoService))
    private readonly eventoService: EventoService,
  ) {}

  async createRendimento(
    matriculaId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina> {
    return await this.rendimentoRepository.save(matriculaId, disciplinaId, tx);
  }

  async getRendimentosPorAluno(
    usuarioId: number,
    anoLetivo: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RespostaGetRendimentosAluno> {
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

    const [rendimentos, notasEventos, todosEventos] = await Promise.all([
      this.rendimentoRepository.findByMatriculaId(matricula.id, tx),
      this.eventoService.getNotasEventosPorMatricula(matricula.id, tx),
      this.eventoService.getEventosPorTurmaId(matricula.turma_id, tx),
    ]);

    let totalNotas: number = 0;

    const rendimentosFormatados = rendimentos.map((rendimento) => {
      // Notas já lançadas para esta disciplina, indexadas por evento_id
      const notasPorEventoId = new Map(
        notasEventos
          .filter(
            (nota) => nota.evento?.disciplina_id === rendimento.disciplina_id,
          )
          .map((nota) => [nota.evento_id, nota]),
      );

      // Todos os eventos desta disciplina (incluindo futuros sem nota)
      const eventosDaDisciplina = todosEventos
        .filter((ev) => ev.disciplina_id === rendimento.disciplina_id)
        .map((ev) => {
          const notaExistente = notasPorEventoId.get(ev.id);
          return {
            id: ev.id,
            titulo: ev.titulo || null,
            tipo_evento: ev.tipo_evento || null,
            data_evento: ev.data_evento || null,
            nota_obtida: notaExistente ? notaExistente.nota_obtida : null,
            valor_nota: ev.valor_nota ?? null,
          };
        });

      // Calcula a nota total real somando as notas obtidas nos eventos
      const notaTotalCalculada = eventosDaDisciplina.reduce(
        (acc, ev) => acc + (ev.nota_obtida ?? 0),
        0,
      );

      totalNotas += notaTotalCalculada;

      return {
        id: rendimento.id,
        disciplina: {
          id: rendimento.disciplina?.id || null,
          nome: rendimento.disciplina?.nome || null,
        },
        nota_total: notaTotalCalculada,
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

  async getRendimentosBasePorMatricula(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina[]> {
    return await this.rendimentoRepository.findByMatriculaId(matriculaId, tx);
  }

  async updateSituacaoRendimento(
    id: number,
    situacao: SituacaoRendimento,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina> {
    return await this.rendimentoRepository.updateSituacaoById(id, situacao, tx);
  }
}
