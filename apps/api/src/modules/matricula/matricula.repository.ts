import { Injectable } from "@nestjs/common";
import { Matricula } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class MatriculaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMatriculaPorAluno(
    usuarioId: number,
    anoLetivo: number,
  ): Promise<Matricula | null> {
    const anoAtual = new Date().getFullYear();

    return await this.prisma.matricula.findFirst({
      where: {
        aluno: {
          usuario_id: usuarioId,
        },
        ano_letivo: anoLetivo,
        status: anoLetivo === anoAtual ? "CURSANDO" : undefined,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        turma: true,
      },
    });
  }
}
