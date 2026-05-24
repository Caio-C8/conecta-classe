import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { RendimentoDisciplina, SituacaoRendimento } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class RendimentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRendimento(
    matriculaId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina> {
    const prismaClient = tx || this.prisma;

    const rendimento = await prismaClient.rendimentoDisciplina.create({
      data: {
        matricula_id: matriculaId,
        disciplina_id: disciplinaId,
        nota_total: 0,
        situacao: SituacaoRendimento.CURSANDO,
      },
    });

    return {
      ...rendimento,
      nota_total: rendimento.nota_total.toNumber(),
    };
  }

  async findRendimentosPorMatricula(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina[]> {
    const prismaClient = tx || this.prisma;

    const rendimentos = await prismaClient.rendimentoDisciplina.findMany({
      where: {
        matricula_id: matriculaId,
      },
      include: {
        disciplina: true,
      },
    });

    return rendimentos.map((rendimento) => ({
      ...rendimento,
      nota_total: rendimento.nota_total.toNumber(),
    }));
  }

  async updateSituacaoRendimento(
    id: number,
    situacao: SituacaoRendimento,
    tx?: Prisma.TransactionClient,
  ): Promise<RendimentoDisciplina> {
    const prismaClient = tx || this.prisma;

    const rendimento = await prismaClient.rendimentoDisciplina.update({
      where: {
        id,
      },
      data: {
        situacao,
      },
    });

    return {
      ...rendimento,
      nota_total: rendimento.nota_total.toNumber(),
    };
  }
}
