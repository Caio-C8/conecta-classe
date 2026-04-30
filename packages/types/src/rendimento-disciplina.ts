import { Matricula } from "./matricula";
import { Disciplina } from "./disciplina";
import { NivelEnsino, SituacaoRendimento, TipoEvento } from "./enums";

export interface RendimentoDisciplina {
  id: number;
  matricula_id: number;
  disciplina_id: number;
  nota_total: number;
  situacao: SituacaoRendimento;
  created_at: Date;
  updated_at: Date;

  matricula?: Matricula;
  disciplina?: Disciplina;
}

export interface RespostaGetRendimentosAluno {
  usuario_id: number;
  ano_letivo: number;
  turma: {
    identificacao: string | null;
    serie: number | null;
    nivel_ensino: NivelEnsino | null;
  };
  media_geral: number;
  rendimentos: {
    disciplina: {
      id: number | null;
      nome: string | null;
    };
    nota_total: number;
    situacao: SituacaoRendimento;
    eventos: {
      id: number;
      titulo: string | null;
      tipo_evento: TipoEvento | null;
      data_evento: Date | null;
      nota_obtida: number | null;
      valor_nota: number | null;
    }[];
  }[];
}

const teste = {
  status: 200,
  sucesso: true,
  mensagem: "Operação realizada com sucesso",
  dados: {
    usuario_id: 34,
    ano_letivo: 2026,
    turma: {
      identificacao: "B",
      serie: 9,
      nivel_ensino: "FUNDAMENTAL_2",
    },
    media_geral: 10.75,
    rendimentos: [
      {
        disciplina: {
          id: 17,
          nome: "História",
        },
        nota_total: 12.5,
        situacao: "CURSANDO",
        eventos: [
          {
            id: 10,
            titulo: "Prova Bimestral - Revolução Francesa",
            tipo_evento: "PROVA",
            data_evento: "2026-03-15T10:00:00.000Z",
            nota_obtida: 8.5,
            valor_nota: 10,
          },
          {
            id: 11,
            titulo: "Trabalho em Grupo",
            tipo_evento: "ATIVIDADE",
            data_evento: "2026-04-02T10:00:00.000Z",
            nota_obtida: 4,
            valor_nota: 5,
          },
        ],
      },
      {
        disciplina: {
          id: 18,
          nome: "Geografia",
        },
        nota_total: 9,
        situacao: "CURSANDO",
        eventos: [
          {
            id: 12,
            titulo: "Seminário - Geopolítica",
            tipo_evento: "ATIVIDADE",
            data_evento: "2026-03-20T10:00:00.000Z",
            nota_obtida: 9,
            valor_nota: 10,
          },
        ],
      },
    ],
  },
};
