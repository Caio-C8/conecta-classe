import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TurmaRepository } from "./turma.repository";
import {
  CreateTurmaInput,
  GetTurmasInput,
  Paginacao,
  ResumoTurmas,
  SituacaoRendimento,
  SituacaoTurma,
  StatusMatricula,
  Turma,
  UpdateTurmaInput,
  VincularEDesvincularAlunoInput,
  VincularEDesvincularProfessorInput,
} from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";
import { MatriculaService } from "../matricula/matricula.service";
import { FrequenciaService } from "../frequencia/frequencia.service";
import { RendimentoService } from "../rendimento/rendimento.service";
import { UsuarioService } from "../usuario/usuario.service";
import { DisciplinaService } from "../disciplina/disciplina.service";

@Injectable()
export class TurmaService {
  constructor(
    private readonly turmaRepository: TurmaRepository,
    private readonly prisma: PrismaService,
    private readonly matriculaService: MatriculaService,
    private readonly frequenciaService: FrequenciaService,
    private readonly rendimentoService: RendimentoService,
    private readonly usuarioService: UsuarioService,
    private readonly disciplinaService: DisciplinaService,
  ) {}

  async create(dados: CreateTurmaInput): Promise<Turma> {
    return await this.turmaRepository.save(dados);
  }

  async getOne(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    return turma;
  }

  async getAll(params: GetTurmasInput): Promise<Paginacao<Turma>> {
    const { dados, meta } = await this.turmaRepository.findAll(params);

    return {
      dados,
      meta,
    };
  }

  async countAllTurmasEmAndamentoAtivas(): Promise<ResumoTurmas> {
    const quantidade =
      await this.turmaRepository.countBySituacaoEmAndamentoAndDeletedAtIsNull();

    return {
      quantidade,
    };
  }

  async update(id: number, dados: UpdateTurmaInput): Promise<Turma> {
    if (Object.keys(dados).length === 0) {
      throw new BadRequestException("Nenhum dado fornecido para atualização.");
    }

    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Uma turma inativa não pode ser atualizada.",
      );
    }

    return await this.turmaRepository.updateById(id, dados);
  }

  async softDelete(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException("Turma já está inativada.");
    }

    return await this.turmaRepository.deleteById(id);
  }

  async restore(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (!turma.deleted_at) {
      throw new BadRequestException("Turma já está ativada.");
    }

    return await this.turmaRepository.restoreById(id);
  }

  async encerrar(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível encerrar uma turma inativada.",
      );
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException("Turma já está encerrada.");
    }

    return await this.prisma.$transaction(async (tx) => {
      const isFundamental1 = turma.nivel_ensino === "FUNDAMENTAL_1";

      const matriculas =
        await this.matriculaService.getMatriculasEmCursoPorTurma(turma.id, tx);

      if (matriculas.length === 0) {
        throw new NotFoundException(
          "Nenhuma matrícula encontrada para esta turma.",
        );
      }

      for (const matricula of matriculas) {
        const usuarioAlunoId = matricula.aluno?.usuario_id;
        let alunoReprovado = false;

        const frequencia = await this.frequenciaService.getFrequenciaAluno(
          usuarioAlunoId!,
          matricula.ano_letivo,
          tx,
        );

        const rendimentos = await this.rendimentoService.getRendimentosPorAluno(
          usuarioAlunoId!,
          matricula.ano_letivo,
          tx,
        );

        for (const rendimento of rendimentos.rendimentos) {
          const nota = rendimento.nota_total;
          let percentualFrequencia = 100;
          let situacaoRendimento: SituacaoRendimento;

          if (isFundamental1) {
            percentualFrequencia =
              frequencia.frequencia?.presenca_percentual ?? 100;
          } else {
            const frequenciaEspecifica = frequencia.frequencias?.find(
              (f) => f.disciplina.id === rendimento.disciplina.id,
            );

            percentualFrequencia =
              frequenciaEspecifica?.presenca_percentual ?? 100;
          }

          if (nota >= 60 && percentualFrequencia >= 75) {
            situacaoRendimento = SituacaoRendimento.APROVADO;
          } else if (nota < 60 && percentualFrequencia >= 75) {
            situacaoRendimento = SituacaoRendimento.REPROVADO_POR_NOTA;
            alunoReprovado = true;
          } else if (nota >= 60 && percentualFrequencia < 75) {
            situacaoRendimento = SituacaoRendimento.REPROVADO_POR_FALTA;
            alunoReprovado = true;
          } else {
            situacaoRendimento = SituacaoRendimento.REPROVADO_POR_NOTA_E_FALTA;
            alunoReprovado = true;
          }

          await this.rendimentoService.updateSituacaoRendimento(
            rendimento.id,
            situacaoRendimento,
            tx,
          );
        }

        const statusMatricula = alunoReprovado
          ? StatusMatricula.REPROVADO
          : StatusMatricula.APROVADO;

        await this.matriculaService.updateStatusMatricula(
          matricula.id,
          statusMatricula,
          tx,
        );
      }

      return await this.turmaRepository.updateSituacaoById(
        id,
        SituacaoTurma.ENCERRADA,
        tx,
      );
    });
  }

  async retomar(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível retomar uma turma inativada.",
      );
    }

    if (turma.situacao !== SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Apenas turmas encerradas podem ser retomadas.",
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const matriculas =
        await this.matriculaService.getMatriculasEncerradasPorTurma(
          turma.id,
          tx,
        );

      for (const matricula of matriculas) {
        const rendimentos =
          await this.rendimentoService.getRendimentosBasePorMatricula(
            matricula.id,
            tx,
          );

        for (const rendimento of rendimentos) {
          await this.rendimentoService.updateSituacaoRendimento(
            rendimento.id,
            SituacaoRendimento.CURSANDO,
            tx,
          );
        }

        await this.matriculaService.updateStatusMatricula(
          matricula.id,
          StatusMatricula.CURSANDO,
          tx,
        );
      }

      return await this.turmaRepository.updateSituacaoById(
        id,
        SituacaoTurma.EM_ANDAMENTO,
        tx,
      );
    });
  }

  async vincularProfessor(
    id: number,
    dados: VincularEDesvincularProfessorInput,
  ): Promise<Turma | null> {
    const professor = await this.usuarioService.getProfessorPorId(
      dados.professorId,
    );

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const disciplina = await this.disciplinaService.getPorId(
      dados.disciplinaId,
    );

    if (!disciplina) {
      throw new NotFoundException("Disciplina não encontrada.");
    }

    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível vincular professores a uma turma inativa.",
      );
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível vincular professores a uma turma encerrada.",
      );
    }

    const vinculoExistente = await this.turmaRepository.findProfessorTurmaByTurmaIdAndProfessorIdAndDisciplinaId(
      id,
      dados.professorId,
      dados.disciplinaId,
    );

    if (vinculoExistente) {
      throw new BadRequestException(
        "Este professor já está vinculado a esta turma com esta disciplina.",
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const turmaComVinculos = await this.turmaRepository.saveProfessorTurma(
        id,
        dados.professorId,
        dados.disciplinaId,
        tx,
      );

      await this.matriculaService.sincronizarNovaDisciplinaParaAlunos(
        id,
        dados.disciplinaId,
        tx,
      );

      return turmaComVinculos;
    });
  }

  async vincularAluno(
    id: number,
    dados: VincularEDesvincularAlunoInput,
  ): Promise<Turma | null> {
    const aluno = await this.usuarioService.getAlunoPorId(dados.alunoId);

    if (!aluno) {
      throw new NotFoundException("Aluno não encontrado.");
    }

    const turma = await this.turmaRepository.findById(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível vincular alunos a uma turma inativa.",
      );
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível vincular alunos a uma turma encerrada.",
      );
    }

    const matricularEmCurso =
      await this.matriculaService.getMatriculasEmCursoPorTurma(id);

    if (matricularEmCurso.length >= 30) {
      throw new BadRequestException(
        "Não é mais possível vincular alunos a esta turma. Limite de alunos atingido.",
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const disciplinaIds = await this.turmaRepository.findDisciplinasByTurmaId(
        id,
        tx,
      );

      await this.matriculaService.createMatriculaComRendimentos(
        dados.alunoId,
        id,
        turma.ano_letivo,
        disciplinaIds,
        tx,
      );

      return this.turmaRepository.findByIdWithMatriculas(id, tx);
    });
  }

  async desvincularProfessor(
    turmaId: number,
    dados: VincularEDesvincularProfessorInput,
  ): Promise<void> {
    const professor = await this.usuarioService.getProfessorPorId(
      dados.professorId,
    );

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const disciplina = await this.disciplinaService.getPorId(
      dados.disciplinaId,
    );

    if (!disciplina) {
      throw new NotFoundException("Disciplina não encontrada.");
    }

    const turma = await this.turmaRepository.findById(turmaId);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível remover vínculos de uma turma inativada.",
      );
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível remover vínculos de uma turma já encerrada.",
      );
    }

    const vinculoExistente = await this.turmaRepository.findProfessorTurmaByTurmaIdAndProfessorIdAndDisciplinaId(
      turmaId,
      dados.professorId,
      dados.disciplinaId,
    );

    if (!vinculoExistente) {
      throw new NotFoundException(
        "Vínculo entre o professor, a turma e a disciplina não encontrado.",
      );
    }

    await this.turmaRepository.deleteProfessorTurma(
      turmaId,
      dados.professorId,
      dados.disciplinaId,
    );
  }

  async desvincularAluno(
    turmaId: number,
    dados: VincularEDesvincularAlunoInput,
  ): Promise<void> {
    const aluno = await this.usuarioService.getAlunoPorId(dados.alunoId);

    if (!aluno) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const turma = await this.turmaRepository.findById(turmaId);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível alterar vínculos de uma turma inativada.",
      );
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível alterar vínculos de uma turma já encerrada.",
      );
    }

    await this.matriculaService.transferirAlunoDaTurma(dados.alunoId, turmaId);
  }
}
