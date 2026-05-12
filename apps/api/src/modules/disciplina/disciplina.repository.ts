import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { CreateDisciplinaInput, Disciplina } from "@repo/types";
import { normalizarString } from "@repo/utils";
import { equal } from "assert";
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
