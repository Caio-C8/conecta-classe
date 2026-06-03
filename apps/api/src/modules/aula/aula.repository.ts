import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class AulaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countByTurmaId(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const prismaClient = tx || this.prisma;

    const hoje = new Date();

    const resultado = await prismaClient.aula.aggregate({
      _sum: { quantidade: true },
      where: {
        turma_id: turmaId,
        data_aula: { lte: hoje },
      },
    });

    return resultado._sum.quantidade || 0;
  }

  async countByTurmaIdGroupByDisciplinaId(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<
    {
      disciplina_id: number | null;
      _sum: { quantidade: number | null };
    }[]
  > {
    const prismaClient = tx || this.prisma;

    const hoje = new Date();

    const resultado = await prismaClient.aula.groupBy({
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
