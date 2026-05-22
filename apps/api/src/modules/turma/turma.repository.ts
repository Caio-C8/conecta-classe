import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import {
  CreateTurmaInput,
  GetTurmasInput,
  Paginacao,
  Status,
  Turma,
  UpdateTurmaInput,
} from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class TurmaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dados: CreateTurmaInput): Promise<Turma> {
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

  async findTurmaPorId(id: number): Promise<Turma | null> {
    return await this.prisma.turma.findUnique({
      where: {
        id,
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
      where.OR = [{ identificacao: { contains: pesquisa, mode: "insensitive" } }];
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

  async updateTurma(
    id: number,
    dados: UpdateTurmaInput,
  ): Promise<Turma> {
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

  async softDelete(id: number): Promise<Turma> {
    return await this.prisma.turma.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Turma> {
    return await this.prisma.turma.update({
      where: {
        id,
      },
      data: {
        deleted_at: null,
      },
    });
  }
}
