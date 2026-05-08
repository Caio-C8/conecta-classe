import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async buscarTurmasDoProfessor(usuarioId: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new Error('Professor não encontrado para este usuário.');
    }

    const turmasVinculadas = await this.prisma.professorTurma.findMany({
      where: {
        professor_id: professor.id,
      },
      include: {
        turma: {
          include: {
            _count: {
              select: { matriculas: true }, 
            },
          },
        },
        disciplina: true, 
      },
    });

    return turmasVinculadas.map((vinculo) => ({
      idTurma: vinculo.turma.id,
      nomeTurma: `${vinculo.turma.serie}º Ano ${vinculo.turma.identificacao}`,
      materia: vinculo.disciplina.nome,
      numeroAlunos: vinculo.turma._count.matriculas,
    }));
  }
}