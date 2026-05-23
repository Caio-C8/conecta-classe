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
import { TurmaService } from "./turma.service";
import { Paginacao, Turma } from "@repo/types";
import { CreateTurmaDto } from "./dtos/create-turma.dto";
import { UpdateTurmaDto } from "./dtos/update-turma.dto";
import { GetTurmasDto } from "./dtos/get-turmas.dto";
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

  @Get()
  @Papeis("ADMINISTRADOR")
  async buscarTodasTurmas(
    @Query() params: GetTurmasDto,
  ): Promise<Paginacao<Turma>> {
    return await this.turmaService.getAll(params);
  }

  @Get("/:id")
  @Papeis("ADMINISTRADOR")
  async buscarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.getOne(id);
  }

  @Patch("/:id")
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma atualizada com sucesso.")
  async atualizarTurma(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: UpdateTurmaDto,
  ): Promise<Turma> {
    return await this.turmaService.update(id, dados);
  }

  @Patch("/:id/inativar")
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma inativada com sucesso.")
  async inativarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.softDelete(id);
  }

  @Patch("/:id/ativar")
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma ativada com sucesso.")
  async ativarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.restore(id);
  }

  @Patch("/:id/encerrar")
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma encerrada com sucesso.")
  async encerrarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.encerrar(id);
  }

  @Patch("/:id/retomar")
  @Papeis("ADMINISTRADOR")
  @MensagemResposta("Turma retomada com sucesso.")
  async retomarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.retomar(id);
  }
}
