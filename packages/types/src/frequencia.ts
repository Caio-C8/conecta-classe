import { Aula } from "./aula";
import { NivelEnsino } from "./enums";
import { Matricula } from "./matricula";

export interface Frequencia {
  id: number;
  aula_id: number;
  matricula_id: number;
  numero_faltas: number;
  created_at: Date;
  updated_at: Date;

  aula?: Aula;
  matricula?: Matricula;
}

export interface RespostaGetFrequenciaAluno {
  usuario_id: number;
  ano_letivo: number;
  visao: "GERAL" | "POR_DISCIPLINA";
  turma: {
    identificacao: string;
    serie: number;
    nivel_ensino: NivelEnsino;
  };
  frequencia?: {
    total_aulas: number;
    total_faltas: number;
    presenca_percentual: number;
  };
  frequencias?: {
    disciplina: {
      id: number;
      nome: string;
    };
    aulas_realizadas: number;
    faltas: number;
    presenca_percentual: number;
  }[];
}
