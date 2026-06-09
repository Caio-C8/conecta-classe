import { Matricula } from "./matricula";
import { Disciplina } from "./disciplina";
import {
  NivelEnsino,
  SituacaoRendimento,
  SituacaoTurma,
  TipoEvento,
} from "./enums";

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
    situacao: SituacaoTurma | null;
  };
  media_geral: number;
  rendimentos: {
    id: number;
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
