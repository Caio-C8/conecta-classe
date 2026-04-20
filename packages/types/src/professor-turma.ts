import { Professor } from "./professor";
import { Turma } from "./turma";
import { Disciplina } from "./disciplina";

export interface ProfessorTurma {
  id: number;
  professor_id: number;
  turma_id: number;
  disciplina_id: number;
  created_at: Date;
  updated_at: Date;

  professor?: Professor;
  turma?: Turma;
  disciplina?: Disciplina;
}
