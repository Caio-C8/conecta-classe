import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import {
  CreateDisciplinaInput,
  Disciplina,
  GetDisciplinasInput,
  Paginacao,
  Status,
  UpdateDisciplinaInput,
} from "@repo/types";
import { normalizarString } from "@repo/utils";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class DisciplinaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDisciplina(dados: CreateDisciplinaInput): Promise<Disciplina> {
    const data: Prisma.DisciplinaCreateInput = {
      nome: dados.nome,
      nome_search: normalizarString(dados.nome),
    };

    return await this.prisma.disciplina.create({
      data,
    });
  }

  async udpateDisciplina(
    id: number,
    dados: UpdateDisciplinaInput,
  ): Promise<Disciplina> {
    const data: Prisma.DisciplinaUpdateInput = {
      nome: dados.nome ? dados.nome : undefined,
      nome_search: dados.nome ? normalizarString(dados.nome) : undefined,
    };

    return await this.prisma.disciplina.update({
      where: {
        id,
      },
      data,
    });
  }

  async findDisciplinaPorId(id: number): Promise<Disciplina | null> {
    return await this.prisma.disciplina.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(params: GetDisciplinasInput): Promise<Paginacao<Disciplina>> {
    const { limite, pagina, status, pesquisa } = params;

    const skip = (pagina - 1) * limite;

    const where: Prisma.DisciplinaWhereInput = {
      deleted_at:
        status === Status.ATIVO
          ? null
          : status === Status.INATIVO
            ? { not: null }
            : undefined,
    };

    if (pesquisa) {
      where.OR = [{ nome_search: { contains: normalizarString(pesquisa) } }];
    }

    const [total, dados] = await this.prisma.$transaction([
      this.prisma.disciplina.count({ where }),
      this.prisma.disciplina.findMany({
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

  async findDisciplinaPorNome(nome: string): Promise<Disciplina | null> {
    return await this.prisma.disciplina.findFirst({
      where: {
        OR: [
          {
            nome: {
              equals: nome,
            },
          },
          {
            nome_search: {
              equals: normalizarString(nome),
            },
          },
        ],
      },
    });
  }

  async findDisciplinasPorTurma(turmaId: number): Promise<Disciplina[]> {
    return await this.prisma.disciplina.findMany({
      where: {
        professores: {
          some: { turma_id: turmaId },
        },
      },
      distinct: ["id"],
    });
  }
}
