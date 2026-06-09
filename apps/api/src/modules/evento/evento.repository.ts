import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { Evento, NotaEvento } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTurmaId(
    turmaId: number,
    matriculaId?: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Evento[]> {
    const prismaClient = tx || this.prisma;

    const includeConfig: Prisma.EventoInclude = {
      disciplina: true,
    };

    if (matriculaId) {
      includeConfig.notas_eventos = {
        where: { matricula_id: matriculaId },
      };
    }

    const eventos = await prismaClient.evento.findMany({
      where: {
        turma_id: turmaId,
      },
      include: includeConfig,
      orderBy: {
        data_evento: "asc",
      },
    });

    return eventos.map((evento: any) => {
      let nota_obtida = undefined;

      if (evento.notas_eventos && evento.notas_eventos.length > 0) {
        nota_obtida = evento.notas_eventos[0].nota_obtida?.toNumber() ?? null;
      }

      const { notas_eventos, ...restoEvento } = evento;

      return {
        ...restoEvento,
        valor_nota: evento.valor_nota?.toNumber() ?? null,
        ...(nota_obtida !== undefined && { nota_obtida }),
      } as Evento;
    });
  }

  async findNotasByMatriculaId(
    matriculaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<NotaEvento[]> {
    const prismaClient = tx || this.prisma;

    const notas = await prismaClient.notaEvento.findMany({
      where: {
        matricula_id: matriculaId,
      },
      include: {
        evento: true,
      },
      orderBy: {
        evento: {
          data_evento: "asc",
        },
      },
    });

    return notas.map((nota) => ({
      ...nota,
      nota_obtida: nota.nota_obtida?.toNumber() ?? null,
      evento: {
        ...nota.evento,
        valor_nota: nota.evento.valor_nota?.toNumber() ?? null,
      },
    }));
  }
}
