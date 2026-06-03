import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DisciplinaRepository } from "./disciplina.repository";
import {
  CreateDisciplinaInput,
  Disciplina,
  GetDisciplinasInput,
  Paginacao,
  ResumoDisciplinas,
  UpdateDisciplinaInput,
} from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class DisciplinaService {
  constructor(private readonly disciplinaRepository: DisciplinaRepository) {}

  async createDisciplina(dados: CreateDisciplinaInput): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findByNome(
      dados.nome,
    );

    if (disciplina) {
      throw new BadRequestException("Já existe uma disciplina com este nome.");
    }

    return await this.disciplinaRepository.save(dados);
  }

  async updateDisciplina(
    id: number,
    dados: UpdateDisciplinaInput,
  ): Promise<Disciplina> {
    if (Object.keys(dados).length === 0) {
      throw new BadRequestException("Nenhum dado fornecido para atualização.");
    }

    const disciplina = await this.disciplinaRepository.findById(id);

    if (!disciplina) {
      throw new NotFoundException("Disciplina não encontrada.");
    }

    if (disciplina.deleted_at) {
      throw new BadRequestException(
        "Uma disciplina inativa não pode ser atualizada.",
      );
    }

    return await this.disciplinaRepository.updateById(id, dados);
  }

  async getAll(params: GetDisciplinasInput): Promise<Paginacao<Disciplina>> {
    const { dados, meta } = await this.disciplinaRepository.findAll(params);

    return {
      dados,
      meta,
    };
  }

  async getPorId(id: number): Promise<Disciplina | null> {
    return await this.disciplinaRepository.findById(id);
  }

  async countAllDisciplinasAtivas(): Promise<ResumoDisciplinas> {
    const quantidade =
      await this.disciplinaRepository.countByDeletedAtIsNull();
    return { quantidade };
  }

  async softDelete(id: number): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findById(id);

    if (!disciplina) {
      throw new NotFoundException("Disciplina não encontrada.");
    }

    if (disciplina.deleted_at) {
      throw new BadRequestException("Disciplina já está inativada.");
    }

    return await this.disciplinaRepository.deleteById(id);
  }

  async restore(id: number): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findById(id);

    if (!disciplina) {
      throw new NotFoundException("Disciplina não encontrada.");
    }

    if (!disciplina.deleted_at) {
      throw new BadRequestException("Disciplina já está ativada.");
    }

    return await this.disciplinaRepository.restoreById(id);
  }

  async getDisciplinasPorTurmas(
    turmaId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Disciplina[]> {
    return await this.disciplinaRepository.findByTurmaId(turmaId, tx);
  }
}
