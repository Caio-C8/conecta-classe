import { StatusMatricula } from "./enums";
import { Aluno } from "./aluno";
import { Turma } from "./turma";
import { Frequencia } from "./frequencia";
import { NotaEvento } from "./nota-evento";
import { RendimentoDisciplina } from "./rendimento-disciplina";

export interface Matricula {
  id: number;
  aluno_id: number;
  turma_id: number;
  ano_letivo: number;
  status: StatusMatricula;
  created_at: Date;
  updated_at: Date;

  aluno?: Aluno;
  turma?: Turma;
  frequencias?: Frequencia[];
  notas_eventos?: NotaEvento[];
  rendimentos_disciplinas?: RendimentoDisciplina[];
}
