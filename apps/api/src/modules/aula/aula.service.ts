import { Injectable } from "@nestjs/common";
import { AulaRepository } from "./aula.repository";
import { Prisma } from "@repo/database";

@Injectable()
export class AulaService {
  constructor(private readonly aulaRepository: AulaRepository) {}

  async getTotalAulasPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    return await this.aulaRepository.findTotalAulasPorTurma(turmaId, tx);
  }

  async getAulasPorDisciplinaPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<
    {
      disciplina_id: number | null;
      _sum: { quantidade: number | null };
    }[]
  > {
    return await this.aulaRepository.findAulasPorDisciplinaPorTurma(
      turmaId,
      tx,
    );
  }
}
