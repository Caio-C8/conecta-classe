import { Injectable } from "@nestjs/common";
import { DisciplinaRepository } from "./disciplina.repository";
import { Disciplina } from "@repo/types";

@Injectable()
export class DisciplinaService {
  constructor(private readonly disciplinaRepository: DisciplinaRepository) {}

  async getDisciplinasPorTurmas(turmaId: number): Promise<Disciplina[]> {
    return await this.disciplinaRepository.findDisciplinasPorTurma(turmaId);
  }
}
