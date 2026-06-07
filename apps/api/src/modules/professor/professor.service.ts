import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { RegistrarChamadaDto } from './dto/Registrar-chamada.dto';
import { RegistrarNotasDto } from './dto/Registrar-notas.dto';

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

  async buscarAlunosParaChamada(turmaId: number, dataStr?: string) {
    let aulaIdInterno: number | undefined = undefined;

    if (dataStr) {
      const dataBusca = new Date(dataStr); 
      const inicioDoDia = new Date(dataBusca);
      inicioDoDia.setUTCHours(0, 0, 0, 0);
      const fimDoDia = new Date(dataBusca);
      fimDoDia.setUTCHours(23, 59, 59, 999);

      const aulaExistente = await this.prisma.aula.findFirst({
        where: {
          turma_id: turmaId,
          data_aula: {
            gte: inicioDoDia, 
            lte: fimDoDia,    
          },
        }
      });

      if (aulaExistente) {
        aulaIdInterno = aulaExistente.id;
      }
    }

    const listaDeAlunos = await this.prisma.matricula.findMany({
      where:  { turma_id: turmaId, status: 'CURSANDO' },
      include: {
        aluno: {
          include: {
            usuario: { select: { nome: true } }
          }
        },
        frequencias: aulaIdInterno ? {
          where: { aula_id: aulaIdInterno }
        } : false
      }
    });  
    
    const listaDeAlunosFormatada = listaDeAlunos.map(matricula => {
      let faltasDoAluno = matricula.frequencias?.[0]?.numero_faltas || 0;

      return {
        id: matricula.aluno_id,
        matricula_id: matricula.id,
        nome: matricula.aluno?.usuario?.nome, 
        faltas: faltasDoAluno
      };
    });

    return listaDeAlunosFormatada;
  }

  async salvarChamada(professorId: number, dto: RegistrarChamadaDto) {
    const dataFormatada = new Date(dto.data_aula);
    
    const inicioDoDia = new Date(dataFormatada);
    inicioDoDia.setUTCHours(0, 0, 0, 0);
    const fimDoDia = new Date(dataFormatada);
    fimDoDia.setUTCHours(23, 59, 59, 999);

    const aulaExistente = await this.prisma.aula.findFirst({
      where: {
        turma_id: dto.turma_id,
        data_aula: {
          gte: inicioDoDia,
          lte: fimDoDia,
        },
      }
    });

    if (aulaExistente) {
      const aulaAtualizada = await this.prisma.aula.update({
        where: { id: aulaExistente.id },
        data: {
          quantidade: dto.quantidade,
          frequencias: {
            deleteMany: {}, 
            createMany: {
              data: dto.frequencias.map(frequenciaFront => ({
                matricula_id: frequenciaFront.matricula_id,
                numero_faltas: frequenciaFront.numero_faltas
              }))
            }
          }
        }
      });

      return { aulaId: aulaAtualizada.id };
    }

    const novaAula = await this.prisma.aula.create({
      data: {
        turma_id: dto.turma_id,
        disciplina_id: dto.disciplina_id,
        professor_id: professorId,
        quantidade: dto.quantidade,
        data_aula: dataFormatada,
        frequencias: {
          createMany: {
            data: dto.frequencias.map(frequenciaFront => ({
              matricula_id: frequenciaFront.matricula_id,
              numero_faltas: frequenciaFront.numero_faltas
            }))
          }
        }
      }
    });

    return { aulaId: novaAula.id };
  }

  async buscarEventosPendentes(professorId: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: professorId }
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    const hoje = new Date();

    const eventosPassados = await this.prisma.evento.findMany({
      where: {
        criador_id: professor.id,
        data_evento: { lt: hoje }, 
        valor_nota: { not: null }  
      },
      include: {
        turma: {
          select: {
            serie: true,
            identificacao: true,
            _count: {
              select: { matriculas: { where: { status: 'CURSANDO' } } } 
            }
          }
        },
        _count: {
          select: { notas_eventos: true } 
        },
        disciplina: {
          select: { nome: true }
        }
      },
      orderBy: {
        data_evento: 'asc' 
      }
    });

    const eventosPendentes = eventosPassados.filter(evento => {
      const totalAlunos = evento.turma._count.matriculas;
      const notasLancadas = evento._count.notas_eventos;
      
      return notasLancadas < totalAlunos;
    });

    return eventosPendentes.map(evento => ({
      id: evento.id,
      titulo: evento.titulo,
      data_evento: evento.data_evento,
      disciplina: evento.disciplina.nome,
      turma: `${evento.turma.serie}º Ano ${evento.turma.identificacao}`,
      progresso: `${evento._count.notas_eventos}/${evento.turma._count.matriculas} notas lançadas`
    }));
  }


  async registrarNotas(usuarioId: number, eventoId: number, dto: RegistrarNotasDto) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId }
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!evento || evento.criador_id !== professor.id) {
      throw new Error("Evento não encontrado ou você não tem permissão para editá-lo.");
    }

    if (evento.valor_nota === null) {
      throw new Error("Este evento não é avaliativo, logo não pode receber notas.");
    }

    const valorMaximo = evento.valor_nota.toNumber(); 

    for (const notaFront of dto.notas) {
      if (notaFront.nota_obtida > valorMaximo) {
        throw new Error(`A nota ${notaFront.nota_obtida} é maior que o valor máximo da avaliação (${valorMaximo}).`);
      }
    }

    const idsDosAlunos = dto.notas.map(n => n.matricula_id);

    await this.prisma.$transaction([
      this.prisma.notaEvento.deleteMany({
        where: {
          evento_id: eventoId,
          matricula_id: { in: idsDosAlunos }
        }
      }),
      this.prisma.notaEvento.createMany({
        data: dto.notas.map(n => ({
          evento_id: eventoId,
          matricula_id: n.matricula_id,
          nota_obtida: n.nota_obtida
        }))
      })
    ]);

    return { 
      sucesso: true, 
      mensagem: "Notas registradas/atualizadas com sucesso!" 
    };
  }

  async buscarHistoricoEventos(professorId: number, pagina: number = 1, limite: number = 10) {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: professorId }
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    const paginaAtual = Math.max(1, Number(pagina));
    const itensPorPagina = Math.max(1, Number(limite));
    
    const pularRegistos = (paginaAtual - 1) * itensPorPagina;

    const [eventos, totalEventos] = await this.prisma.$transaction([
      this.prisma.evento.findMany({
        where: { criador_id: professor.id },
        orderBy: { data_evento: 'desc' }, 
        skip: pularRegistos,
        take: itensPorPagina,
        include: {
          turma: { select: { serie: true, identificacao: true } },
          disciplina: { select: { nome: true } }
        }
      }),
      this.prisma.evento.count({
        where: { criador_id: professor.id }
      })
    ]);

    const totalPaginas = Math.ceil(totalEventos / itensPorPagina);

    const eventosFormatados = eventos.map(evento => ({
      id: evento.id,
      titulo: evento.titulo,
      data_evento: evento.data_evento,
      disciplina: evento.disciplina.nome,
      turma: `${evento.turma.serie}º Ano ${evento.turma.identificacao}`,
      valor_nota: evento.valor_nota,
      tipo_evento: evento.tipo_evento
    }));

    return {
      eventos: eventosFormatados,
      metadados: {
        total_registros: totalEventos,
        total_paginas: totalPaginas,
        pagina_atual: paginaAtual,
        itens_por_pagina: itensPorPagina
      }
    };
  }
}