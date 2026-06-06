import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { Matricula, SituacaoRendimento, StatusMatricula } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class MatriculaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveWithRendimentos(
    alunoId: number,
    turmaId: number,
    anoLetivo: number,
    disciplinaIds: number[],
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula> {
    const prismaClient = tx || this.prisma;

    const matricula = await prismaClient.matricula.create({
      data: {
        aluno_id: alunoId,
        turma_id: turmaId,
        ano_letivo: anoLetivo,
        status: StatusMatricula.CURSANDO,
        rendimentos_disciplinas: {
          create: disciplinaIds.map((id) => ({
            disciplina_id: id,
            nota_total: 0,
            situacao: SituacaoRendimento.CURSANDO,
          })),
        },
      },
      include: {
        rendimentos_disciplinas: true,
      },
    });

    return {
      ...matricula,
      rendimentos_disciplinas: matricula.rendimentos_disciplinas.map(
        (rendimento) => ({
          ...rendimento,
          nota_total: rendimento.nota_total.toNumber(),
        }),
      ),
    };
  }

  async findAllByAlunoId(
    alunoId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula[]> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findMany({
      where: {
        aluno_id: alunoId,
      },
      orderBy: {
        ano_letivo: "desc",
      },
    });
  }

  async findByAlunoId(
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

  async findByTurmaIdAndStatusCursando(
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

  async findByTurmaIdAndStatusNotCursando(
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

  async findByAlunoIdAndAnoLetivo(
    alunoId: number,
    anoLetivo: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findFirst({
      where: {
        aluno_id: alunoId,
        ano_letivo: anoLetivo,
        status: StatusMatricula.CURSANDO,
      },
    });
  }

  async findByAlunoIdAndTurmaId(
    alunoId: number,
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findFirst({
      where: {
        aluno_id: alunoId,
        turma_id: turmaId,
      },
    });
  }

  async findByAlunoIdAndTurmaIdAndStatusCursando(
    alunoId: number,
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.matricula.findFirst({
      where: {
        aluno_id: alunoId,
        turma_id: turmaId,
        status: StatusMatricula.CURSANDO,
      },
    });
  }

  async updateStatusById(
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

  async updateStatusTransferidoById(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaClient = tx || this.prisma;

    await prismaClient.matricula.update({
      where: {
        id: id,
      },
      data: {
        status: StatusMatricula.TRANSFERIDO,
        rendimentos_disciplinas: {
          updateMany: {
            where: { matricula_id: id },
            data: { situacao: SituacaoRendimento.TRANSFERIDO },
          },
        },
      },
    });
  }

  async updateStatusCursandoById(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula> {
    const prismaClient = tx || this.prisma;

    const matricula = await prismaClient.matricula.update({
      where: {
        id,
      },
      data: {
        status: StatusMatricula.CURSANDO,
        rendimentos_disciplinas: {
          updateMany: {
            where: { matricula_id: id },
            data: { situacao: SituacaoRendimento.CURSANDO },
          },
        },
      },
      include: {
        rendimentos_disciplinas: true,
      },
    });

    return {
      ...matricula,
      rendimentos_disciplinas: matricula.rendimentos_disciplinas.map(
        (rendimento) => ({
          ...rendimento,
          nota_total: rendimento.nota_total.toNumber(),
        }),
      ),
    };
  }
}
