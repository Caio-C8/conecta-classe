import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { Frequencia } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class FrequenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sumNumeroFaltasByMatriculaId(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const prismaClient = tx || this.prisma;

    const hoje = new Date();

    const resultado = await prismaClient.frequencia.aggregate({
      _sum: { numero_faltas: true },
      where: {
        matricula_id: matriculaId,
        aula: {
          data_aula: { lte: hoje },
        },
      },
    });

    return resultado._sum.numero_faltas || 0;
  }

  async findByMatriculaId(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Frequencia[]> {
    const prismaClient = tx || this.prisma;

    const hoje = new Date();

    return await prismaClient.frequencia.findMany({
      where: {
        matricula_id: matriculaId,
        aula: {
          data_aula: { lte: hoje },
        },
      },
      include: {
        aula: true,
      },
    });
  }
}
