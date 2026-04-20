import { Injectable } from "@nestjs/common";
import { AulaRepository } from "./aula.repository";

@Injectable()
export class AulaService {
  constructor(private readonly aulaRepository: AulaRepository) {}

  async getTotalAulasPorTurma(turmaId: number): Promise<number> {
    return await this.aulaRepository.findTotalAulasPorTurma(turmaId);
  }

  async getAulasPorDisciplinaPorTurma(turmaId: number): Promise<
    {
      disciplina_id: number | null;
      _sum: { quantidade: number | null };
    }[]
  > {
    return await this.aulaRepository.findAulasPorDisciplinaPorTurma(turmaId);
  }
}
