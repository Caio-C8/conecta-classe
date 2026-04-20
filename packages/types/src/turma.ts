import { NivelEnsino, SituacaoTurma } from "./enums";
import { ProfessorTurma } from "./professor-turma";
import { Matricula } from "./matricula";
import { Aula } from "./aula";
import { Evento } from "./evento";

export interface Turma {
  id: number;
  identificacao: string;
  serie: number;
  nivel_ensino: NivelEnsino;
  sala: string;
  ano_letivo: number;
  situacao: SituacaoTurma;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  professores?: ProfessorTurma[];
  matriculas?: Matricula[];
  aulas?: Aula[];
  eventos?: Evento[];
}
