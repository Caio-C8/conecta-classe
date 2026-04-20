import { ProfessorTurma } from "./professor-turma";
import { Aula } from "./aula";
import { Evento } from "./evento";
import { RendimentoDisciplina } from "./rendimento-disciplina";

export interface Disciplina {
  id: number;
  nome: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  professores?: ProfessorTurma[];
  aulas?: Aula[];
  eventos?: Evento[];
  rendimentos?: RendimentoDisciplina[];
}
