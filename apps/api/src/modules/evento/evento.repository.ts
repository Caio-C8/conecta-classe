import { Injectable } from "@nestjs/common";
import { Evento } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findEventosPorTurma(turmaId: number): Promise<Evento[]> {
    const eventos = await this.prisma.evento.findMany({
      where: {
        turma_id: turmaId,
      },
      include: {
        disciplina: true,
      },
      orderBy: {
        data_evento: "asc",
      },
    });

    return eventos.map((evento) => {
      return {
        ...evento,
        valor_nota: evento.valor_nota?.toNumber() || null,
      };
    });
  }
}
