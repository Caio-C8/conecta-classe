import { Body, Controller, Post } from "@nestjs/common";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { DisciplinaService } from "./disciplina.service";
import { Disciplina } from "@repo/types";
import { CreateDisciplinaDto } from "./dtos/create-disciplina.dto";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";

@Controller("disciplinas")
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Disciplina criada com sucesso.")
  async criarDisciplina(
    @Body() dados: CreateDisciplinaDto,
  ): Promise<Disciplina> {
    return await this.disciplinaService.createDisciplina(dados);
  }
}
