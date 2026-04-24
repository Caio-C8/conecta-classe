import { Injectable } from "@nestjs/common";
import { Disciplina } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class DisciplinaRepository {
  constructor(private readonly prisma: PrismaService) {}

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
