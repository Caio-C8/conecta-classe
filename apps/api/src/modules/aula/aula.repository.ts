import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class AulaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTotalAulasPorTurma(turmaId: number): Promise<number> {
    const hoje = new Date();

    const resultado = await this.prisma.aula.aggregate({
      _sum: { quantidade: true },
      where: {
        turma_id: turmaId,
        data_aula: { lte: hoje },
      },
    });

    return resultado._sum.quantidade || 0;
  }

  async findAulasPorDisciplinaPorTurma(turmaId: number): Promise<
    {
      disciplina_id: number | null;
      _sum: { quantidade: number | null };
    }[]
  > {
    const hoje = new Date();

    const resultado = await this.prisma.aula.groupBy({
      by: ["disciplina_id"],
      where: {
        turma_id: turmaId,
        data_aula: { lte: hoje },
      },
      _sum: { quantidade: true },
    });

    return resultado;
  }
}
