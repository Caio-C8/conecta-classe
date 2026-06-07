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

  @Get("turmas")
  async getTurmas(
    @GetUsuario("id") usuarioId: number,
  ): Promise<ProfessorTurmaDetalhado[]> {
    return this.professorService.buscarTurmasDoProfessor(usuarioId);
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
  ): Promise<Evento[]> {
    return this.professorService.buscarEventosPendentes(usuarioId);
  }

  @Get("eventos/proximos")
  async getProximosEventos(
    @GetUsuario("id") usuarioId: number,
  ): Promise<Evento[]> {
    return this.professorService.buscarProximosEventos(usuarioId);
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

  @Get("aulas")
  async buscarAulas(@GetUsuario("id") usuarioId: number): Promise<Aula[]> {
    return await this.professorService.buscarAulasDoProfessor(usuarioId);
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
  ): Promise<Matricula[]> {
    return await this.professorService.buscarMatriculasCursando(turmaId);
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
}

// @Get("eventos/historico")
// async getHistoricoEventos(
//   @GetUsuario("id") usuarioId: number,
//   @Query("pagina") pagina?: string,
//   @Query("limite") limite?: string,
// ) {
//   const numPagina = pagina ? Number(pagina) : 1;
//   const numLimite = limite ? Number(limite) : 10;

//   return this.professorService.buscarHistoricoEventos(
//     usuarioId,
//     numPagina,
//     numLimite,
//   );
// }

// @Get("eventos/:id/notas")
// async getDiarioDeNotas(
//   @GetUsuario("id") usuarioId: number,
//   @Param("id") eventoId: string,
// ) {
//   return this.professorService.buscarDiarioDeNotas(usuarioId, +eventoId);
// }

// @Get("turmas/:id/alunos")
// async buscarAlunosParaChamada(
//   @Param("id") turmaId: string,
//   @Query("data") dataStr?: string,
// ) {
//   return this.professorService.buscarAlunosParaChamada(
//     Number(turmaId),
//     dataStr,
//   );
// }
