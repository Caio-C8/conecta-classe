import { Body, Controller, Post } from "@nestjs/common";
import { TurmaService } from "./turma.service";
import { Turma } from "@repo/types";
import { CreateTurmaDto } from "./dtos/create-turma.dto";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";

@Controller("turmas")
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma criada com sucesso.")
  async criarTurma(@Body() dados: CreateTurmaDto): Promise<Turma> {
    return await this.turmaService.create(dados);
  }
}
