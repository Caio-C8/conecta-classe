import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { DisciplinaService } from "./disciplina.service";
import { Disciplina, Paginacao } from "@repo/types";
import { CreateDisciplinaDto } from "./dtos/create-disciplina.dto";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { GetDisciplinasDto } from "./dtos/get-disciplinas.dto";

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

  @Get()
  @Papeis("ADMINISTRADOR")
  async buscarTodasDisciplinas(
    @Query() params: GetDisciplinasDto,
  ): Promise<Paginacao<Disciplina>> {
    return await this.disciplinaService.getAll(params);
  }
}
