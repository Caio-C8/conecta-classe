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
  Turma,
  UpdateTurmaInput,
} from "@repo/types";

@Injectable()
export class TurmaService {
  constructor(private readonly turmaRepository: TurmaRepository) {}

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
}
