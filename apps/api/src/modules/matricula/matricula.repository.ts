import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { Matricula, StatusMatricula } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class MatriculaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMatriculaPorAluno(
    usuarioId: number,
    anoLetivo: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findFirst({
      where: {
        aluno: {
          usuario_id: usuarioId,
        },
        ano_letivo: anoLetivo,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        turma: true,
      },
    });
  }

  async findMatriculasEmCursoPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula[]> {
    const prismaClient = tx || this.prisma;

    const matriculas = await prismaClient.matricula.findMany({
      where: {
        turma_id: turmaId,
        status: "CURSANDO",
      },
      include: {
        aluno: true,
        rendimentos_disciplinas: true,
        frequencias: {
          include: { aula: true },
        },
      },
    });

    return matriculas.map((matricula) => ({
      ...matricula,
      rendimentos_disciplinas: matricula.rendimentos_disciplinas.map((rd) => {
        return {
          ...rd,
          nota_total: rd.nota_total.toNumber(),
        };
      }),
    }));
  }

  async findMatriculasEncerradasPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula[]> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findMany({
      where: {
        turma_id: turmaId,
        status: {
          in: [StatusMatricula.APROVADO, StatusMatricula.REPROVADO],
        },
      },
    });
  }

  async updateStatusMatricula(
    id: number,
    status: StatusMatricula,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
