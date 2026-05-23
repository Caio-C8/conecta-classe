import { BadRequestException, Injectable } from "@nestjs/common";
import { MatriculaRepository } from "./matricula.repository";
import { Matricula, StatusMatricula } from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class MatriculaService {
  constructor(private readonly matriculaRepository: MatriculaRepository) {}

  async createMatriculaComRendimentos(
    alunoId: number,
    turmaId: number,
    anoLetivo: number,
    disciplinaIds: number[],
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula> {
    const matriculaExistenteNaTurma =
      await this.matriculaRepository.findMatriculaPorAlunoETurma(
        alunoId,
        turmaId,
        tx,
      );

    if (matriculaExistenteNaTurma) {
      throw new BadRequestException(
        "Este aluno já possui uma matrícula nesta turma.",
      );
    }

    const matriculaExistenteNoAnoLetivo =
      await this.matriculaRepository.findMatriculaPorAlunoEAnoLetivo(
        alunoId,
        anoLetivo,
        tx,
      );

    if (matriculaExistenteNoAnoLetivo) {
      throw new BadRequestException(
        "Este aluno já possui uma matrícula ativa.",
      );
    }

    return await this.matriculaRepository.createMatriculaComRendimentos(
      alunoId,
      turmaId,
      anoLetivo,
      disciplinaIds,
      tx,
    );
  }

  async getMatriculaPorAluno(
    usuarioId: number,
    anoLetivo: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula | null> {
    return await this.matriculaRepository.findMatriculaPorAluno(
      usuarioId,
      anoLetivo,
      tx,
    );
  }

  async getMatriculasEmCursoPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula[]> {
    return await this.matriculaRepository.findMatriculasEmCursoPorTurma(
      turmaId,
      tx,
    );
  }

  async getMatriculasEncerradasPorTurma(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula[]> {
    return await this.matriculaRepository.findMatriculasEncerradasPorTurma(
      turmaId,
      tx,
    );
  }

  async updateStatusMatricula(
    id: number,
    status: StatusMatricula,
    tx?: Prisma.TransactionClient,
  ): Promise<Matricula> {
    return await this.matriculaRepository.updateStatusMatricula(id, status, tx);
  }
}
