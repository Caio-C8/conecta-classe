import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { DisciplinaService } from "./disciplina.service";
import { Disciplina, Paginacao, Papel, ResumoDisciplinas } from "@repo/types";
import { CreateDisciplinaDto } from "./dtos/create-disciplina.dto";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { GetDisciplinasDto } from "./dtos/get-disciplinas.dto";
import { UpdateDisciplinaDto } from "./dtos/update-disciplina.dto";

@Controller("disciplinas")
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Disciplina criada com sucesso.")
  async criarDisciplina(
    @Body() dados: CreateDisciplinaDto,
  ): Promise<Disciplina> {
    return await this.disciplinaService.createDisciplina(dados);
  }

  @Patch("/:id")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Disciplina atualizada com sucesso.")
  async atualizarDisciplina(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: UpdateDisciplinaDto,
  ): Promise<Disciplina> {
    return await this.disciplinaService.updateDisciplina(id, dados);
  }

  @Get()
  @Papeis(Papel.ADMINISTRADOR)
  async buscarTodasDisciplinas(
    @Query() params: GetDisciplinasDto,
  ): Promise<Paginacao<Disciplina>> {
    return await this.disciplinaService.getAll(params);
  }

  @Get("/resumo")
  @Papeis(Papel.ADMINISTRADOR)
  async buscarResumoDisciplinas(): Promise<ResumoDisciplinas> {
    return await this.disciplinaService.countAllDisciplinasAtivas();
  }

  @Patch("/:id/inativar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Disciplina inativada com sucesso.")
  async inativarDisciplina(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Disciplina> {
    return await this.disciplinaService.softDelete(id);
  }

  @Patch("/:id/ativar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Disciplina ativada com sucesso.")
  async ativarDisciplina(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Disciplina> {
    return await this.disciplinaService.restore(id);
  }
}
