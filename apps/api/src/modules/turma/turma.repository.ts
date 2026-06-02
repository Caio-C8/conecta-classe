import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import {
  CreateTurmaInput,
  GetTurmasInput,
  Paginacao,
  ProfessorTurma,
  SituacaoTurma,
  Status,
  Turma,
  UpdateTurmaInput,
} from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class TurmaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(dados: CreateTurmaInput): Promise<Turma> {
    const data: Prisma.TurmaCreateInput = {
      identificacao: dados.identificacao,
      serie: dados.serie,
      nivel_ensino: dados.nivel_ensino,
      sala: dados.sala,
      ano_letivo: dados.ano_letivo,
    };

    return await this.prisma.turma.create({
      data,
    });
  }

  async findById(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Turma | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.turma.findUnique({
      where: {
        id,
      },
      include: {
        matriculas: {
          include: {
            aluno: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                    nome_search: true,
                    papel: true,
                    trocar_senha: true,
                    usuario: true,
                    updated_at: true,
                    created_at: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        },
        professores: {
          include: {
            disciplina: true,
            professor: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                    nome_search: true,
                    papel: true,
                    trocar_senha: true,
                    usuario: true,
                    updated_at: true,
                    created_at: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByIdWithMatriculas(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Turma | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.turma.findUnique({
      where: {
        id,
      },
      include: {
        matriculas: true,
      },
    });
  }

  async findAll(params: GetTurmasInput): Promise<Paginacao<Turma>> {
    const { limite, pagina, status, pesquisa } = params;

    const skip = (pagina - 1) * limite;

    const where: Prisma.TurmaWhereInput = {
      deleted_at:
        status === Status.ATIVO
          ? null
          : status === Status.INATIVO
            ? { not: null }
            : undefined,
    };

    if (pesquisa) {
      where.OR = [
        { identificacao: { contains: pesquisa, mode: "insensitive" } },
      ];
    }

    const [total, dados] = await this.prisma.$transaction([
      this.prisma.turma.count({ where }),
      this.prisma.turma.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          id: "desc",
        },
      }),
    ]);

    return {
      dados,
      meta: {
        total,
        pagina,
        limite,
        ultima_pagina: Math.ceil(total / limite),
      },
    };
  }

  async findProfessorTurmaByTurmaIdAndProfessorIdAndDisciplinaId(
    turmaId: number,
    professorId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<ProfessorTurma | null> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.professorTurma.findFirst({
      where: {
        turma_id: turmaId,
        professor_id: professorId,
        disciplina_id: disciplinaId,
      },
    });
  }

  async findDisciplinasByTurmaId(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<number[]> {
    const prismaClient = tx || this.prisma;

    const vinculos = await prismaClient.professorTurma.findMany({
      where: {
        turma_id: turmaId,
      },
      select: {
        disciplina_id: true,
      },
    });

    return [...new Set(vinculos.map((v) => v.disciplina_id))];
  }

  async countBySituacaoEmAndamentoAndDeletedAtIsNull(): Promise<number> {
    return await this.prisma.turma.count({
      where: {
        situacao: SituacaoTurma.EM_ANDAMENTO,
        deleted_at: null,
      },
    });
  }

  async updateById(id: number, dados: UpdateTurmaInput): Promise<Turma> {
    const data: Prisma.TurmaUpdateInput = {
      identificacao: dados.identificacao ? dados.identificacao : undefined,
      serie: dados.serie ? dados.serie : undefined,
      nivel_ensino: dados.nivel_ensino ? dados.nivel_ensino : undefined,
      sala: dados.sala ? dados.sala : undefined,
      ano_letivo: dados.ano_letivo ? dados.ano_letivo : undefined,
    };

    return await this.prisma.turma.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateSituacaoById(
    id: number,
    situacao: SituacaoTurma,
    tx?: Prisma.TransactionClient,
  ): Promise<Turma> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.turma.update({
      where: {
        id,
      },
      data: {
        situacao,
      },
    });
  }

  async deleteById(id: number): Promise<Turma> {
    return await this.prisma.turma.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async restoreById(id: number): Promise<Turma> {
    return await this.prisma.turma.update({
      where: {
        id,
      },
      data: {
        deleted_at: null,
      },
    });
  }

  async saveProfessorTurma(
    turmaId: number,
    professorId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Turma | null> {
    const prismaClient = tx || this.prisma;

    const data: Prisma.ProfessorTurmaCreateInput = {
      turma: {
        connect: {
          id: turmaId,
        },
      },
      professor: {
        connect: {
          id: professorId,
        },
      },
      disciplina: {
        connect: {
          id: disciplinaId,
        },
      },
    };

    await prismaClient.professorTurma.create({
      data,
    });

    return await prismaClient.turma.findUnique({
      where: {
        id: turmaId,
      },
      include: {
        professores: true,
      },
    });
  }

  async deleteProfessorTurma(
    turmaId: number,
    professorId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaClient = tx || this.prisma;

    await prismaClient.professorTurma.deleteMany({
      where: {
        turma_id: turmaId,
        professor_id: professorId,
        disciplina_id: disciplinaId,
      },
    });
  }
}
