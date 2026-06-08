import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  Aula,
  CreateEventoInput,
  Evento,
  Matricula,
  NivelEnsino,
  ProfessorTurmaDetalhado,
  RegistrarFrequenciaInput,
  RegistrarNotasInput,
  SituacaoTurma,
  StatusMatricula,
  UpdateEventoInput,
} from "@repo/types";
import { Prisma } from "@repo/database";

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async buscarTurmasDoProfessor(
    usuarioId: number,
  ): Promise<ProfessorTurmaDetalhado[]> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const resultados = await this.prisma.professorTurma.findMany({
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

    return resultados.map((item) => {
      const { turma, disciplina, ...dadosVinculo } = item;
      const { _count, ...dadosTurma } = turma;

      return {
        ...dadosVinculo,
        quantidade_matriculas: _count.matriculas,
        turma: dadosTurma,
        disciplina: disciplina,
      };
    });
  }

  async criarEvento(
    usuarioId: number,
    dados: CreateEventoInput,
  ): Promise<Evento> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) throw new NotFoundException("Professor não encontrado.");

    const turma = await this.prisma.turma.findUnique({
      where: { id: dados.turma_id },
    });

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException("Ações bloqueadas para esta turma.");
    }

    const vinculo = await this.prisma.professorTurma.findFirst({
      where: {
        professor_id: professor.id,
        turma_id: dados.turma_id,
        disciplina_id: dados.disciplina_id,
      },
    });

    if (!vinculo) {
      throw new BadRequestException(
        "Você não está vinculado a esta turma e disciplina.",
      );
    }

    if (dados.valor_nota !== undefined) {
      const somaPontos = await this.prisma.evento.aggregate({
        _sum: { valor_nota: true },
        where: {
          turma_id: dados.turma_id,
          disciplina_id: dados.disciplina_id,
        },
      });

      const totalAtual = Number(somaPontos._sum.valor_nota || 0);
      if (totalAtual + dados.valor_nota > 100) {
        throw new BadRequestException(
          `Limite de pontos excedido. A disciplina já possui ${totalAtual} pontos distribuídos.`,
        );
      }
    }

    const data: Prisma.EventoCreateInput = {
      titulo: dados.titulo,
      data_evento: new Date(
        Date.UTC(
          dados.data_evento.getUTCFullYear(),
          dados.data_evento.getUTCMonth(),
          dados.data_evento.getUTCDate(),
        ),
      ),
      descricao: dados.descricao,
      valor_nota: dados.valor_nota,
      tipo_evento: dados.tipo_evento,
      turma: {
        connect: { id: dados.turma_id },
      },
      disciplina: {
        connect: { id: dados.disciplina_id },
      },
      criador: {
        connect: { id: professor.id },
      },
    };

    const evento = await this.prisma.evento.create({
      data,
    });

    return {
      ...evento,
      valor_nota: evento.valor_nota ? Number(evento.valor_nota) : null,
    };
  }

  async atualizarEvento(
    usuarioId: number,
    eventoId: number,
    dados: UpdateEventoInput,
  ): Promise<Evento> {
    if (Object.keys(dados).length === 0) {
      throw new BadRequestException("Nenhum dado fornecido para atualização.");
    }

    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: { turma: true },
    });

    if (!evento || evento.criador_id !== professor.id) {
      throw new NotFoundException("Evento não encontrado ou sem permissão.");
    }

    if (evento.turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível lançar ou alterar notas de uma turma encerrada.",
      );
    }

    const data: Prisma.EventoUpdateInput = {
      titulo: dados.titulo ? dados.titulo : undefined,
      descricao: dados.descricao !== undefined ? dados.descricao : undefined,
      tipo_evento: dados.tipo_evento ? dados.tipo_evento : undefined,
      valor_nota: dados.valor_nota !== undefined ? dados.valor_nota : undefined,
      data_evento: dados.data_evento
        ? new Date(
            Date.UTC(
              dados.data_evento.getUTCFullYear(),
              dados.data_evento.getUTCMonth(),
              dados.data_evento.getUTCDate(),
            ),
          )
        : undefined,
    };

    const eventoAtualizado = await this.prisma.evento.update({
      where: { id: eventoId },
      data,
    });

    return {
      ...eventoAtualizado,
      valor_nota: eventoAtualizado.valor_nota
        ? Number(eventoAtualizado.valor_nota)
        : null,
    };
  }

  async excluirEvento(usuarioId: number, eventoId: number): Promise<void> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: { turma: true, notas_eventos: true },
    });

    if (!evento || evento.criador_id !== professor.id) {
      throw new NotFoundException("Evento não encontrado ou sem permissão.");
    }

    if (evento.turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível lançar ou alterar notas de uma turma encerrada.",
      );
    }

    if (evento.notas_eventos.length > 0) {
      throw new BadRequestException(
        "Não é possível excluir um evento que já possui notas lançadas.",
      );
    }

    await this.prisma.evento.delete({
      where: { id: eventoId },
    });
  }

  async buscarEventosPendentes(usuarioId: number): Promise<Evento[]> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const hoje = new Date();

    const fimDeHoje = new Date(
      Date.UTC(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const eventosPassados = await this.prisma.evento.findMany({
      where: {
        criador_id: professor.id,
        data_evento: { lte: fimDeHoje },
        valor_nota: { not: null },
      },
      include: {
        turma: {
          include: {
            _count: {
              select: {
                matriculas: { where: { status: StatusMatricula.CURSANDO } },
              },
            },
          },
        },
        disciplina: true,
        _count: {
          select: { notas_eventos: true },
        },
      },
      orderBy: {
        data_evento: "asc",
      },
    });

    const eventosPendentes = eventosPassados.filter((evento) => {
      const totalAlunos = evento.turma._count.matriculas;
      const notasLancadas = evento._count.notas_eventos;

      return totalAlunos === 0 || notasLancadas < totalAlunos;
    });

    return eventosPendentes.map((evento) => {
      const { _count: countEvento, turma, disciplina, ...dadosEvento } = evento;
      const { _count: countTurma, ...dadosTurma } = turma;

      return {
        ...dadosEvento,
        valor_nota: dadosEvento.valor_nota
          ? Number(dadosEvento.valor_nota)
          : null,
        turma: dadosTurma,
        disciplina: disciplina,
      };
    });
  }

  async buscarProximosEventos(professorId: number): Promise<Evento[]> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: professorId },
    });

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }

    const hoje = new Date();

    const fimDeHoje = new Date(
      Date.UTC(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const eventos = await this.prisma.evento.findMany({
      where: {
        criador_id: professor.id,
        data_evento: {
          gt: fimDeHoje,
        },
      },
      orderBy: {
        data_evento: "asc",
      },
      take: 5,
      include: {
        turma: true,
        disciplina: true,
      },
    });

    return eventos.map((evento) => {
      return {
        ...evento,
        valor_nota: evento.valor_nota ? Number(evento.valor_nota) : null,
      };
    });
  }

  async buscarEventos(
    usuarioId: number,
    turmaId: number,
    disciplinaId: number,
  ): Promise<Evento[]> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const eventos = await this.prisma.evento.findMany({
      where: {
        turma_id: turmaId,
        disciplina_id: disciplinaId,
        criador_id: professor.id,
      },
      include: {
        turma: true,
        disciplina: true,
      },
      orderBy: {
        data_evento: "desc",
      },
    });

    return eventos.map((evento) => {
      return {
        ...evento,
        valor_nota: evento.valor_nota ? Number(evento.valor_nota) : null,
      };
    });
  }

  async buscarEventoPorId(
    usuarioId: number,
    eventoId: number,
  ): Promise<Evento> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        notas_eventos: true,
      },
    });

    if (!evento || evento.criador_id !== professor.id) {
      throw new NotFoundException(
        "Evento não encontrado ou você não tem permissão para acessá-lo.",
      );
    }

    return {
      ...evento,
      valor_nota: evento.valor_nota ? Number(evento.valor_nota) : null,
      notas_eventos: evento.notas_eventos.map((notaEvento) => {
        return {
          ...notaEvento,
          nota_obtida: notaEvento.nota_obtida
            ? Number(notaEvento.nota_obtida)
            : null,
        };
      }),
    };
  }

  async buscarAulasDoProfessor(
    usuarioId: number,
    turmaId?: number,
    disciplinaId?: number,
  ): Promise<Aula[]> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const whereClause: Prisma.AulaWhereInput = {
      professor_id: professor.id,
    };

    if (turmaId) whereClause.turma_id = turmaId;
    if (disciplinaId) whereClause.disciplina_id = disciplinaId;

    return await this.prisma.aula.findMany({
      where: whereClause,
      include: {
        turma: true,
        disciplina: true,
      },
      orderBy: {
        data_aula: "desc",
      },
    });
  }

  async buscarAulaPorId(usuarioId: number, aulaId: number): Promise<Aula> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const aula = await this.prisma.aula.findUnique({
      where: { id: aulaId },
      include: {
        turma: true,
        disciplina: true,
        frequencias: true,
      },
    });

    if (!aula || aula.professor_id !== professor.id) {
      throw new NotFoundException(
        "Aula não encontrada ou você não tem permissão para acessá-la.",
      );
    }

    return aula;
  }

  async realizarFrequencia(
    usuarioId: number,
    dados: RegistrarFrequenciaInput,
  ): Promise<Aula> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const turma = await this.prisma.turma.findUnique({
      where: { id: dados.turma_id },
    });

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException("Ações bloqueadas para esta turma.");
    }

    if (turma.nivel_ensino === NivelEnsino.FUNDAMENTAL_1) {
      if (dados.disciplina_id !== undefined) {
        throw new BadRequestException(
          "Para o Fundamental I, a chamada deve ser por dia letivo global.",
        );
      }

      const vinculoTurma = await this.prisma.professorTurma.findFirst({
        where: { professor_id: professor.id, turma_id: dados.turma_id },
      });

      if (!vinculoTurma) {
        throw new BadRequestException("Você não está vinculado a esta turma.");
      }
    } else {
      if (!dados.disciplina_id) {
        throw new BadRequestException(
          "Para este nível de ensino, a disciplina é obrigatória na chamada.",
        );
      }

      const vinculo = await this.prisma.professorTurma.findFirst({
        where: {
          professor_id: professor.id,
          turma_id: dados.turma_id,
          disciplina_id: dados.disciplina_id,
        },
      });

      if (!vinculo) {
        throw new BadRequestException(
          "Você não está vinculado a esta turma e disciplina.",
        );
      }
    }

    const inicioDoDia = new Date(dados.data_aula);
    inicioDoDia.setUTCHours(0, 0, 0, 0);
    const fimDoDia = new Date(dados.data_aula);
    fimDoDia.setUTCHours(23, 59, 59, 999);

    const aulaExistente = await this.prisma.aula.findFirst({
      where: {
        turma_id: dados.turma_id,
        data_aula: {
          gte: inicioDoDia,
          lte: fimDoDia,
        },
      },
    });

    let resultado: Aula | null = null;

    if (aulaExistente) {
      const frequenciasAtuais = await this.prisma.frequencia.findMany({
        where: { aula_id: aulaExistente.id },
      });

      const operacoesFrequencia = dados.frequencias.map((fFront) => {
        const existente = frequenciasAtuais.find(
          (fDB) => fDB.matricula_id === fFront.matricula_id,
        );

        if (existente) {
          return this.prisma.frequencia.update({
            where: { id: existente.id },
            data: { numero_faltas: fFront.numero_faltas },
          });
        } else {
          return this.prisma.frequencia.create({
            data: {
              aula_id: aulaExistente.id,
              matricula_id: fFront.matricula_id,
              numero_faltas: fFront.numero_faltas,
            },
          });
        }
      });

      await this.prisma.$transaction([
        this.prisma.aula.update({
          where: { id: aulaExistente.id },
          data: { quantidade: dados.quantidade },
        }),
        ...operacoesFrequencia,
      ]);

      resultado = await this.prisma.aula.findUnique({
        where: { id: aulaExistente.id },
        include: {
          turma: true,
          disciplina: true,
          frequencias: true,
        },
      });
    } else {
      resultado = await this.prisma.aula.create({
        data: {
          turma_id: dados.turma_id,
          disciplina_id: dados.disciplina_id,
          professor_id: professor.id,
          quantidade: dados.quantidade,
          data_aula: dados.data_aula,
          frequencias: {
            createMany: {
              data: dados.frequencias.map((f) => ({
                matricula_id: f.matricula_id,
                numero_faltas: f.numero_faltas,
              })),
            },
          },
        },
        include: {
          turma: true,
          disciplina: true,
          frequencias: true,
        },
      });
    }

    return resultado as Aula;
  }

  async buscarMatriculasCursando(turmaId: number): Promise<Matricula[]> {
    const turma = await this.prisma.turma.findUnique({
      where: { id: turmaId },
    });

    if (!turma) {
      throw new NotFoundException("Turma não encontrada.");
    }

    return await this.prisma.matricula.findMany({
      where: {
        turma_id: turmaId,
        status: StatusMatricula.CURSANDO,
      },
      include: {
        aluno: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        aluno: {
          usuario: {
            nome: "asc",
          },
        },
      },
    });
  }

  async registrarNotas(
    usuarioId: number,
    eventoId: number,
    dados: RegistrarNotasInput,
  ): Promise<Evento | null> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!professor) {
      throw new NotFoundException("Professor não encontrado.");
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: { turma: true },
    });

    if (!evento || evento.criador_id !== professor.id) {
      throw new NotFoundException("Evento não encontrado ou sem permissão.");
    }

    if (evento.turma.situacao === SituacaoTurma.ENCERRADA) {
      throw new BadRequestException(
        "Não é possível lançar ou alterar notas de uma turma encerrada.",
      );
    }

    if (evento.valor_nota === null) {
      throw new BadRequestException(
        "Este evento não é avaliativo, logo não pode receber notas.",
      );
    }

    const valorMaximo = Number(evento.valor_nota);

    for (const notaFront of dados.notas) {
      if (notaFront.nota_obtida > valorMaximo) {
        throw new BadRequestException(
          `A nota ${notaFront.nota_obtida} é maior que o valor máximo da avaliação (${valorMaximo}).`,
        );
      }
    }

    const operacoesUpsert = dados.notas.map((n) =>
      this.prisma.notaEvento.upsert({
        where: {
          evento_id_matricula_id: {
            evento_id: eventoId,
            matricula_id: n.matricula_id,
          },
        },
        update: {
          nota_obtida: n.nota_obtida,
        },
        create: {
          evento_id: eventoId,
          matricula_id: n.matricula_id,
          nota_obtida: n.nota_obtida,
        },
      }),
    );

    await this.prisma.$transaction(operacoesUpsert);

    const eventoAtualizado = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        notas_eventos: true,
      },
    });

    if (!eventoAtualizado) {
      return null;
    }

    return {
      ...eventoAtualizado,
      valor_nota: eventoAtualizado?.valor_nota
        ? Number(eventoAtualizado.valor_nota)
        : null,
      notas_eventos: eventoAtualizado.notas_eventos.map((notaEvento) => {
        return {
          ...notaEvento,
          nota_obtida: notaEvento.nota_obtida
            ? Number(notaEvento.nota_obtida)
            : null,
        };
      }),
    };
  }
}
