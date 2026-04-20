import { Professor } from "./professor";
import { Turma } from "./turma";
import { Disciplina } from "./disciplina";
import { Frequencia } from "./frequencia";

export interface Aula {
  id: number;
  turma_id: number;
  disciplina_id: number | null;
  professor_id: number;
  data_aula: Date;
  quantidade: number;
  created_at: Date;
  updated_at: Date;

  turma?: Turma;
  disciplina?: Disciplina;
  professor?: Professor;
  frequencias?: Frequencia[];
}
