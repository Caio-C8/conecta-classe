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
  SituacaoRendimento,
  SituacaoTurma,
  StatusMatricula,
  Turma,
  UpdateTurmaInput,
} from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";
import { MatriculaService } from "../matricula/matricula.service";
import { FrequenciaService } from "../frequencia/frequencia.service";
import { RendimentoService } from "../rendimento/rendimento.service";

@Injectable()
export class TurmaService {
  constructor(
    private readonly turmaRepository: TurmaRepository,
    private readonly prisma: PrismaService,
    private readonly matriculaService: MatriculaService,
    private readonly frequenciaService: FrequenciaService,
    private readonly rendimentoService: RendimentoService,
  ) {}

  async create(dados: CreateTurmaInput): Promise<Turma> {
    return await this.turmaRepository.create(dados);
  }

  async getOne(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findTurmaPorId(id);

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

  async update(id: number, dados: UpdateTurmaInput): Promise<Turma> {
    if (Object.keys(dados).length === 0) {
      throw new BadRequestException("Nenhum dado fornecido para atualização.");
    }

    const turma = await this.turmaRepository.findTurmaPorId(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    return await this.turmaRepository.updateTurma(id, dados);
  }

  async softDelete(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findTurmaPorId(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException("Turma já está inativada.");
    }

    return await this.turmaRepository.softDelete(id);
  }

  async restore(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findTurmaPorId(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (!turma.deleted_at) {
      throw new BadRequestException("Turma já está ativada.");
    }

    return await this.turmaRepository.restore(id);
  }

  async encerrar(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findTurmaPorId(id);

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.deleted_at) {
      throw new BadRequestException(
        "Não é possível encerrar uma turma inativada.",
      );
    }

    if (turma.situacao === "ENCERRADA") {
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

      return await this.turmaRepository.updateSituacaoTurma(
        id,
        SituacaoTurma.ENCERRADA,
        tx,
      );
    });
  }
}
