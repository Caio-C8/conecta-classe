import { BadRequestException, Injectable } from "@nestjs/common";
import { DisciplinaRepository } from "./disciplina.repository";
import { CreateDisciplinaInput, Disciplina } from "@repo/types";

@Injectable()
export class DisciplinaService {
  constructor(private readonly disciplinaRepository: DisciplinaRepository) {}

  async createDisciplina(dados: CreateDisciplinaInput): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findDisciplinaPorNome(
      dados.nome,
    );

    if (disciplina) {
      throw new BadRequestException("Já existe uma disciplina com este nome.");
    }

    return await this.disciplinaRepository.createDisciplina(dados);
  }

  async getDisciplinasPorTurmas(turmaId: number): Promise<Disciplina[]> {
    return await this.disciplinaRepository.findDisciplinasPorTurma(turmaId);
  }
}
