import { Injectable } from "@nestjs/common";
import { TurmaRepository } from "./turma.repository";
import { CreateTurmaInput, Turma } from "@repo/types";

@Injectable()
export class TurmaService {
  constructor(private readonly turmaRepository: TurmaRepository) {}

  async create(dados: CreateTurmaInput): Promise<Turma> {
    return await this.turmaRepository.create(dados);
  }
}
