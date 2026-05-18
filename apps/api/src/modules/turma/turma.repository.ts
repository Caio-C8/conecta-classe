import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { CreateTurmaInput, Turma } from "@repo/types";
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
}
