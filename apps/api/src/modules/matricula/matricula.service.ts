import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MatriculaRepository } from "./matricula.repository";
import { Matricula, StatusMatricula } from "@repo/types";
import { Prisma } from "@repo/database";
import { RendimentoService } from "../rendimento/rendimento.service";

@Injectable()
export class MatriculaService {
  constructor(
    private readonly matriculaRepository: MatriculaRepository,
    @Inject(forwardRef(() => RendimentoService))
    private readonly rendimentoService: RendimentoService,
  ) {}

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
      if (matriculaExistenteNaTurma.status === StatusMatricula.CURSANDO) {
        throw new BadRequestException(
          "Este aluno já possui uma matrícula ativa nesta turma.",
        );
      } else if (
        matriculaExistenteNaTurma.status === StatusMatricula.TRANSFERIDO
      ) {
        return await this.matriculaRepository.reativarMatriculaERendimentos(
          matriculaExistenteNaTurma.id,
          tx,
        );
      } else {
        throw new BadRequestException(
          "Este aluno já está matriculado nesta turma.",
        );
      }
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

  async transferirAlunoDaTurma(
    alunoId: number,
    turmaId: number,
  ): Promise<void> {
    const matriculaAtiva =
      await this.matriculaRepository.findMatriculaAtivaPorAlunoETurma(
        alunoId,
        turmaId,
      );

    if (!matriculaAtiva) {
      throw new NotFoundException(
        "O aluno não possui uma matrícula ativa nesta turma para ser desvinculado.",
      );
    }

    await this.matriculaRepository.transferirMatriculaERendimentos(
      matriculaAtiva.id,
    );
  }

  async sincronizarNovaDisciplinaParaAlunos(
    turmaId: number,
    disciplinaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const matriculas =
      await this.matriculaRepository.findMatriculasEmCursoPorTurma(turmaId, tx);

    for (const matricula of matriculas) {
      const jaPossuiDisciplina = matricula.rendimentos_disciplinas?.some(
        (rd) => rd.disciplina_id === disciplinaId,
      );

      if (!jaPossuiDisciplina) {
        await this.rendimentoService.createRendimento(
          matricula.id,
          disciplinaId,
          tx,
        );
      }
    }
  }
}
