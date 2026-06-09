import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  Patch,
  Delete,
  HttpCode,
  ParseIntPipe,
  HttpStatus,
} from "@nestjs/common";
import { ProfessorService } from "./professor.service";
import { Papeis } from "../../common/decorators/papeis.decorator";
import { GetUsuario } from "../../common/decorators/get-usuario.decorator";
import {
  Aula,
  Evento,
  Matricula,
  Papel,
  ProfessorTurmaDetalhado,
} from "@repo/types";
import { CreateEventoDto } from "./dto/create-evento.dto";
import { RegistrarFrequenciaDto } from "./dto/registrar-frequencia.dto";
import { RegistrarNotasDto } from "./dto/Registrar-notas.dto";
import { UpdateEventoDto } from "./dto/update-evento.dto";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";

@Controller("professor")
@Papeis(Papel.PROFESSOR)
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get("anos-letivos")
  async getAnosLetivos(@GetUsuario("id") usuarioId: number): Promise<number[]> {
    return this.professorService.buscarAnosLetivosDoProfessor(usuarioId);
  }

  @Get("turmas")
  async getTurmas(
    @GetUsuario("id") usuarioId: number,
    @Query("anoLetivo", new ParseIntPipe({ optional: true }))
    anoLetivo?: number,
  ): Promise<ProfessorTurmaDetalhado[]> {
    return this.professorService.buscarTurmasDoProfessor(usuarioId, anoLetivo);
  }

  @Post("eventos")
  @MensagemResposta("Evento criado com sucesso.")
  async criarEvento(
    @GetUsuario("id") usuarioId: number,
    @Body() dados: CreateEventoDto,
  ): Promise<Evento> {
    return await this.professorService.criarEvento(usuarioId, dados);
  }

  @Patch("eventos/:id")
  @MensagemResposta("Evento atualizado com sucesso.")
  async atualizarEvento(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) eventoId: number,
    @Body() dados: UpdateEventoDto,
  ): Promise<Evento> {
    return await this.professorService.atualizarEvento(
      usuarioId,
      eventoId,
      dados,
    );
  }

  @Delete("eventos/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async excluirEvento(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) eventoId: number,
  ): Promise<void> {
    await this.professorService.excluirEvento(usuarioId, eventoId);
  }

  @Get("eventos/pendentes")
  async getEventosPendentes(
    @GetUsuario("id") usuarioId: number,
    @Query("anoLetivo", new ParseIntPipe({ optional: true }))
    anoLetivo?: number,
  ): Promise<Evento[]> {
    return this.professorService.buscarEventosPendentes(usuarioId, anoLetivo);
  }

  @Get("eventos/proximos")
  async getProximosEventos(
    @GetUsuario("id") usuarioId: number,
    @Query("anoLetivo", new ParseIntPipe({ optional: true }))
    anoLetivo?: number,
  ): Promise<Evento[]> {
    return this.professorService.buscarProximosEventos(usuarioId, anoLetivo);
  }

  @Get("eventos/turma/:turmaId/disciplina/:disciplinaId")
  async buscarEventosPorTurmaEDisciplina(
    @GetUsuario("id") usuarioId: number,
    @Param("turmaId", ParseIntPipe) turmaId: number,
    @Param("disciplinaId", ParseIntPipe) disciplinaId: number,
  ): Promise<Evento[]> {
    return await this.professorService.buscarEventos(
      usuarioId,
      turmaId,
      disciplinaId,
    );
  }

  @Get("eventos/:id")
  async buscarEventoPorId(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) eventoId: number,
  ): Promise<Evento> {
    return await this.professorService.buscarEventoPorId(usuarioId, eventoId);
  }

  @Get("aulas")
  async buscarAulas(
    @GetUsuario("id") usuarioId: number,
    @Query("turmaId", new ParseIntPipe({ optional: true })) turmaId?: number,
    @Query("disciplinaId", new ParseIntPipe({ optional: true }))
    disciplinaId?: number,
  ): Promise<Aula[]> {
    return await this.professorService.buscarAulasDoProfessor(
      usuarioId,
      turmaId,
      disciplinaId,
    );
  }

  @Get("aulas/:id")
  async buscarAulaPorId(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) aulaId: number,
  ): Promise<Aula> {
    return await this.professorService.buscarAulaPorId(usuarioId, aulaId);
  }

  @Delete("aulas/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @MensagemResposta("Aula excluída com sucesso.")
  async excluirAula(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) aulaId: number,
  ): Promise<void> {
    await this.professorService.excluirAula(usuarioId, aulaId);
  }

  @Post("frequencia")
  @MensagemResposta("Frequência registrada com sucesso.")
  async registrarFrequencia(
    @GetUsuario("id") usuarioId: number,
    @Body() dados: RegistrarFrequenciaDto,
  ): Promise<Aula> {
    return await this.professorService.realizarFrequencia(usuarioId, dados);
  }

  @Get("turmas/:id/matriculas")
  async buscarMatriculasCursando(
    @Param("id", ParseIntPipe) turmaId: number,
    @Query("disciplinaId", new ParseIntPipe({ optional: true }))
    disciplinaId?: number,
  ): Promise<Matricula[]> {
    return await this.professorService.buscarMatriculasCursando(
      turmaId,
      disciplinaId,
    );
  }

  @Post("eventos/:id/notas")
  @MensagemResposta("Notas registradas com sucesso.")
  async registrarNotas(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) eventoId: number,
    @Body() dados: RegistrarNotasDto,
  ): Promise<Evento | null> {
    return await this.professorService.registrarNotas(
      usuarioId,
      eventoId,
      dados,
    );
  }

  @Delete("eventos/:id/notas")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetarNotas(
    @GetUsuario("id") usuarioId: number,
    @Param("id", ParseIntPipe) eventoId: number,
  ): Promise<void> {
    await this.professorService.resetarNotas(usuarioId, eventoId);
  }
}
