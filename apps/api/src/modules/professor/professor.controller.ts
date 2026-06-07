import { Controller, Get, UseGuards, Param, Query, Body, Post } from "@nestjs/common";
import { ProfessorService } from "./professor.service";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { PapeisGuard } from "../../common/guards/papeis.guard";
import { Papeis } from "../../common/decorators/papeis.decorator";
import { GetUsuario } from "../../common/decorators/get-usuario.decorator";
import { Papel } from "@repo/types";
import { CreateEventoDto } from "./dto/create-evento.dto";
import { RegistrarChamadaDto } from "./dto/Registrar-chamada.dto";
import { RegistrarNotasDto } from "./dto/Registrar-notas.dto";

@Controller("professor")
@UseGuards(JwtGuard, PapeisGuard)
@Papeis(Papel.PROFESSOR)
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get("turmas")
  async getTurmas(@GetUsuario("id") usuarioId: number) {
    return this.professorService.buscarTurmasDoProfessor(usuarioId);
  }

  @Post("eventos")
  async criarEvento(
    @GetUsuario("id") usuarioId: number,
    @Body() dto: CreateEventoDto,
  ) {
    return this.professorService.criarEvento(usuarioId, dto);
  }

  @Get("eventos/proximos")
  async getProximosEventos(@GetUsuario("id") usuarioId: number) {
    return this.professorService.buscarProximosEventos(usuarioId);
  }

  @Get("eventos/pendentes")
  async getEventosPendentes(@GetUsuario("id") usuarioId: number) {
    return this.professorService.buscarEventosPendentes(usuarioId);
  }

  @Get("eventos/historico")
  async getHistoricoEventos(
    @GetUsuario("id") usuarioId: number,
    @Query("pagina") pagina?: string,
    @Query("limite") limite?: string
  ) {
    const numPagina = pagina ? Number(pagina) : 1;
    const numLimite = limite ? Number(limite) : 10;

    return this.professorService.buscarHistoricoEventos(usuarioId, numPagina, numLimite);
  }

  @Get("eventos/:id/notas")
  async getDiarioDeNotas(
    @GetUsuario("id") usuarioId: number,
    @Param("id") eventoId: string,
  ) {
    return this.professorService.buscarDiarioDeNotas(usuarioId, +eventoId);
  }

  @Post("eventos/:id/notas")
  async registrarNotas(
    @GetUsuario("id") usuarioId: number,
    @Param("id") eventoId: string,
    @Body() dto: RegistrarNotasDto,
  ) {
    return this.professorService.registrarNotas(usuarioId, Number(eventoId), dto);
  }

  @Get("turmas/:id/alunos")
  async buscarAlunosParaChamada(
    @Param("id") turmaId: string,
    @Query("data") dataStr?: string,
  ) {
    return this.professorService.buscarAlunosParaChamada(Number(turmaId), dataStr);
  }

  @Post("chamada")
  async registrarChamada(
    @GetUsuario("id") usuarioId: number,
    @Body() dto: RegistrarChamadaDto,
  ) {
    return this.professorService.salvarChamada(usuarioId, dto);
  }
}