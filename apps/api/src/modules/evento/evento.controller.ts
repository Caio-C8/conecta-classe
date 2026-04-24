import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GetUsuario } from "src/common/decorators/get-usuario.decorator";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { EventoService } from "./evento.service";
import { Evento } from "@repo/types";

@Controller("eventos")
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get("/me/:anoLetivo")
  @Papeis("ALUNO")
  async getEventosPorTurma(
    @GetUsuario("id") usuarioId: number,
    @Param("anoLetivo", ParseIntPipe) anoLetivo: number,
  ): Promise<Evento[]> {
    return await this.eventoService.getEventosPorTurma(usuarioId, anoLetivo);
  }
}

const teste = {
  status: 200,
  sucesso: true,
  mensagem: "Operação realizada com sucesso",
  dados: [
    {
      id: 1,
      turma_id: 10,
      disciplina_id: 7,
      criador_id: 4,
      titulo: "Prova Bimestral de Exatas",
      descricao: "Cairá todo o conteúdo sobre Geometria Analítica.",
      tipo_evento: "PROVA",
      valor_nota: 10,
      data_evento: "2026-04-25T15:15:12.860Z",
      created_at: "2026-04-24T15:15:12.862Z",
      updated_at: "2026-04-24T15:15:12.862Z",
      disciplina: {
        id: 7,
        nome: "Matemática",
        deleted_at: null,
        created_at: "2026-04-24T15:15:12.780Z",
        updated_at: "2026-04-24T15:15:12.780Z",
      },
    },
    {
      id: 2,
      turma_id: 10,
      disciplina_id: 8,
      criador_id: 4,
      titulo: "Entrega do Trabalho",
      descricao: "Maquete sobre divisão celular.",
      tipo_evento: "ATIVIDADE",
      valor_nota: 5,
      data_evento: "2026-05-01T15:15:12.860Z",
      created_at: "2026-04-24T15:15:12.862Z",
      updated_at: "2026-04-24T15:15:12.862Z",
      disciplina: {
        id: 8,
        nome: "Biologia",
        deleted_at: null,
        created_at: "2026-04-24T15:15:12.783Z",
        updated_at: "2026-04-24T15:15:12.783Z",
      },
    },
    {
      id: 3,
      turma_id: 10,
      disciplina_id: 8,
      criador_id: 4,
      titulo: "Feira de Ciências",
      descricao: "Apresentação obrigatória no pátio principal.",
      tipo_evento: "GERAL",
      valor_nota: null,
      data_evento: "2026-05-24T15:15:12.860Z",
      created_at: "2026-04-24T15:15:12.862Z",
      updated_at: "2026-04-24T15:15:12.862Z",
      disciplina: {
        id: 8,
        nome: "Biologia",
        deleted_at: null,
        created_at: "2026-04-24T15:15:12.783Z",
        updated_at: "2026-04-24T15:15:12.783Z",
      },
    },
  ],
};
