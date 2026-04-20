import { Matricula } from "./matricula";
import { Disciplina } from "./disciplina";
import { SituacaoRendimento } from "./enums";

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
