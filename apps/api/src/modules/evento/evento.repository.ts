import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { Evento, NotaEvento } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTurmaId(turmaId: number): Promise<Evento[]> {
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
      nota_obtida: nota.nota_obtida?.toNumber() || null,
      evento: {
        ...nota.evento,
        valor_nota: nota.evento.valor_nota?.toNumber() || null,
      },
    }));
  }
}
