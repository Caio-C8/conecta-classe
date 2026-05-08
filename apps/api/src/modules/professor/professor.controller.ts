import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { PapeisGuard } from '../../common/guards/papeis.guard';
import { Papeis } from '../../common/decorators/papeis.decorator';
import { GetUsuario } from '../../common/decorators/get-usuario.decorator';
import { Papel } from '@repo/types';

@Controller('professor')
@UseGuards(JwtGuard, PapeisGuard)
@Papeis(Papel.PROFESSOR) 
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get('turmas')
  async getTurmas(@GetUsuario('id') usuarioId: number) {
    return this.professorService.buscarTurmasDoProfessor(usuarioId);
  }
}