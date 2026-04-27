import { Injectable } from "@nestjs/common";
import { RendimentoDisciplina } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class RendimentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRendimentosPorMatricula(
    matriculaId: number,
  ): Promise<RendimentoDisciplina[]> {
    const rendimentos = await this.prisma.rendimentoDisciplina.findMany({
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
}
