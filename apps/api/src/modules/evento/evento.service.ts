import { Injectable, NotFoundException } from "@nestjs/common";
import { EventoRepository } from "./evento.repository";
import { MatriculaService } from "../matricula/matricula.service";
import { Evento, NotaEvento } from "@repo/types";

@Injectable()
export class EventoService {
  constructor(
    private readonly eventoRepository: EventoRepository,
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
      throw new NotFoundException("Matricula não encontrada.");
    }

    return await this.eventoRepository.findEventosPorTurma(matricula.turma_id);
  }

  async getNotasEventosPorMatricula(
    matriculaId: number,
  ): Promise<NotaEvento[]> {
    return await this.eventoRepository.findNotasEventosPorMatricula(
      matriculaId,
    );
  }
}
