import { Injectable } from "@nestjs/common";
import { Frequencia } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class FrequenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sumFaltasPorMatricula(matriculaId: number): Promise<number> {
    const hoje = new Date();

    const resultado = await this.prisma.frequencia.aggregate({
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

  async findFrequenciasPorMatricula(
    matriculaId: number,
  ): Promise<Frequencia[]> {
    const hoje = new Date();

    return await this.prisma.frequencia.findMany({
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
