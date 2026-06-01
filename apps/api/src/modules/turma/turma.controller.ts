import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { TurmaService } from "./turma.service";
import { Paginacao, Papel, ResumoTurmas, Turma } from "@repo/types";
import { CreateTurmaDto } from "./dtos/create-turma.dto";
import { UpdateTurmaDto } from "./dtos/update-turma.dto";
import { GetTurmasDto } from "./dtos/get-turmas.dto";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { VincularEDesvincularProfessorDto } from "./dtos/vincular-desvincular-professor.dto";
import { VincularEDesvincularAlunoDto } from "./dtos/vincular-desvincular-aluno.dto";

@Controller("turmas")
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma criada com sucesso.")
  async criarTurma(@Body() dados: CreateTurmaDto): Promise<Turma> {
    return await this.turmaService.create(dados);
  }

  @Post("/:id/vincular/professor")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Professor vinculado com sucesso.")
  async vincularProfessor(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: VincularEDesvincularProfessorDto,
  ): Promise<Turma | null> {
    return await this.turmaService.vincularProfessor(id, dados);
  }

  @Post("/:id/vincular/aluno")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Aluno vinculado com sucesso.")
  async vincularAluno(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: VincularEDesvincularAlunoDto,
  ): Promise<Turma | null> {
    return await this.turmaService.vincularAluno(id, dados);
  }

  @Get()
  @Papeis(Papel.ADMINISTRADOR)
  async buscarTodasTurmas(
    @Query() params: GetTurmasDto,
  ): Promise<Paginacao<Turma>> {
    return await this.turmaService.getAll(params);
  }

  @Get("/resumo")
  @Papeis(Papel.ADMINISTRADOR)
  async buscarResumoTurmas(): Promise<ResumoTurmas> {
    return await this.turmaService.countAllTurmasEmAndamentoAtivas();
  }

  @Get("/:id")
  @Papeis(Papel.ADMINISTRADOR)
  async buscarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.getOne(id);
  }

  @Patch("/:id")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma atualizada com sucesso.")
  async atualizarTurma(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: UpdateTurmaDto,
  ): Promise<Turma> {
    return await this.turmaService.update(id, dados);
  }

  @Patch("/:id/inativar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma inativada com sucesso.")
  async inativarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.softDelete(id);
  }

  @Patch("/:id/ativar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma ativada com sucesso.")
  async ativarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.restore(id);
  }

  @Patch("/:id/encerrar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma encerrada com sucesso.")
  async encerrarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.encerrar(id);
  }

  @Patch("/:id/retomar")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Turma retomada com sucesso.")
  async retomarTurma(@Param("id", ParseIntPipe) id: number): Promise<Turma> {
    return await this.turmaService.retomar(id);
  }

  @Patch("/:id/desvincular/aluno")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Aluno desvinculado com sucesso.")
  async desvincularAluno(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: VincularEDesvincularAlunoDto,
  ): Promise<void> {
    return await this.turmaService.desvincularAluno(id, dados);
  }

  @Delete("/:id/desvincular/professor")
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Professor desvinculado com sucesso.")
  async desvincularProfessor(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: VincularEDesvincularProfessorDto,
  ): Promise<void> {
    return await this.turmaService.desvincularProfessor(id, dados);
  }
}
