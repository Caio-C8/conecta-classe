import { Injectable } from "@nestjs/common";
import { MatriculaRepository } from "./matricula.repository";
import { Matricula } from "@repo/types";

@Injectable()
export class MatriculaService {
  constructor(private readonly matriculaRepository: MatriculaRepository) {}

  async getMatriculaPorAluno(
    usuarioId: number,
    anoLetivo: number,
  ): Promise<Matricula | null> {
    return await this.matriculaRepository.findMatriculaPorAluno(
      usuarioId,
      anoLetivo,
    );
  }
}
