import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';

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


  async criarEvento(professorId: number, dto: CreateEventoDto) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: professorId }
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    return this.prisma.evento.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao ?? "",
        data_evento: new Date(dto.data_evento), 
        valor_nota: dto.valor_nota, 
        tipo_evento: dto.tipo_evento, 
        turma_id: dto.turma_id,
        disciplina_id: dto.disciplina_id,
        criador_id: professor.id,  
      },
    });
  }

  async buscarProximosEventos(professorId: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: professorId }
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    const hoje = new Date(); 

    return this.prisma.evento.findMany({
      where: {
        criador_id: professor.id, 
        data_evento: {
          gte: hoje, 
        }
      },
      orderBy: {
        data_evento: 'asc' 
      },
      take: 5, 
      
      include: {
        turma: {
          select: { serie: true, identificacao: true, nivel_ensino: true }
        },
        disciplina: {
          select: { nome: true }
        }
      }
    });
  }


  async buscarDiarioDeNotas(professorId: number, eventoId: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        turma: {
          include: {
            matriculas: {
              include: {
                aluno: {
                  include: {
                    usuario: { select: { nome: true } } 
                  }
                },
                notas_eventos: {
                  where: { evento_id: eventoId }
                }
              }
            }
          }
        }
      }
    });

    if (!evento) {
      throw new Error("Evento não encontrado.");
    }

    const professor = await this.prisma.professor.findUnique({ where: { usuario_id: professorId } });
    if (!professor || evento.criador_id !== professor.id) {
      throw new Error("Você não tem permissão para acessar o diário deste evento.");
    }

    if (evento.valor_nota === null) {
      throw new Error("Este evento não é avaliativo (não possui nota máxima).");
    }

    const alunosFormatados = evento.turma.matriculas.map((matricula) => {
      const registroDeNota = matricula.notas_eventos[0];

      return {
        matricula_id: matricula.id,
        nome_aluno: matricula.aluno?.usuario?.nome || "Aluno sem nome",
        nota_obtida: registroDeNota ? registroDeNota.nota_obtida : null 
      };
    });

    return {
      evento: {
        id: evento.id,
        titulo: evento.titulo,
        nota_maxima: evento.valor_nota,
      },
      alunos: alunosFormatados
    };
  }
}