import { Controller, Get, UseGuards,Param, Query } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { PapeisGuard } from '../../common/guards/papeis.guard';
import { Papeis } from '../../common/decorators/papeis.decorator';
import { GetUsuario } from '../../common/decorators/get-usuario.decorator';
import { Papel } from '@repo/types';
import { Body, Post } from '@nestjs/common'; 
import { CreateEventoDto } from './dto/create-evento.dto';


@Controller('professor')
@UseGuards(JwtGuard, PapeisGuard)
@Papeis(Papel.PROFESSOR) 
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get('turmas')
  async getTurmas(@GetUsuario('id') usuarioId: number) {
    return this.professorService.buscarTurmasDoProfessor(usuarioId);
  }

  @Post('eventos')
  async criarEvento(
    @GetUsuario('id') usuarioId: number,
    @Body() dto: CreateEventoDto, 
  ) {
    return this.professorService.criarEvento(usuarioId, dto);
  }

  @Get('eventos/proximos')
    async getProximosEventos(@GetUsuario('id') usuarioId: number) {
      return this.professorService.buscarProximosEventos(usuarioId);
    }


  @Get('eventos/:id/notas')
  async getDiarioDeNotas(
    @GetUsuario('id') usuarioId: number,
    @Param('id') eventoId: string 
  ) {
    return this.professorService.buscarDiarioDeNotas(usuarioId, +eventoId);
  }

  
  @Get('turmas/:id/alunos')
  async getAlunosDaTurma(
  @Param('id') turmaId: string,
  @Query('aula_id') aula_idStr?: string 
  ) {
    let numeroAulaId = aula_idStr?  Number(aula_idStr) : undefined
    let numeroTurmaId = Number(turmaId)

    return this.professorService.buscarAlunosParaChamada(numeroTurmaId,numeroAulaId)
  }


}