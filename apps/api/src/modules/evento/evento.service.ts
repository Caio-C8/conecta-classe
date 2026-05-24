import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventoRepository } from "./evento.repository";
import { MatriculaService } from "../matricula/matricula.service";
import { Evento, NotaEvento } from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class EventoService {
  constructor(
    private readonly eventoRepository: EventoRepository,
    @Inject(forwardRef(() => MatriculaService))
    private readonly matriculaService: MatriculaService,
  ) {}

  async getEventosPorTurma(
    usuarioId: number,
    anoLetivo: number,
  ): Promise<Evento[]> {
    const matricula = await this.matriculaService.getMatriculaPorAluno(
      usuarioId,
      anoLetivo,
    );

    if (!matricula) {
      throw new NotFoundException(
        "Matrícula não encontrada para este aluno e ano letivo.",
      );
    }

    return await this.eventoRepository.findEventosPorTurma(matricula.turma_id);
  }

  async getNotasEventosPorMatricula(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<NotaEvento[]> {
    return await this.eventoRepository.findNotasEventosPorMatricula(
      matriculaId,
      tx,
    );
  }
}
