import z from "zod";
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
  porcentagem_frequencia_geral?: number;
  total_faltas?: number;
  total_aulas?: number;
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

export const AlunoFrequenciaSchema = z.object({
  matricula_id: z.coerce.number({
    required_error: "Preencha o campo matrícula.",
    invalid_type_error: "Matrícula inválida.",
  }),
  numero_faltas: z.coerce
    .number({
      required_error: "Preencha o número de faltas.",
      invalid_type_error: "Número de faltas inválido.",
    })
    .min(0, "O número de faltas não pode ser negativo."),
});

export const RegistrarFrequenciaSchema = z.object({
  turma_id: z.coerce.number({
    required_error: "Preencha o campo turma.",
    invalid_type_error: "Turma inválida.",
  }),
  disciplina_id: z.coerce
    .number({
      invalid_type_error: "Disciplina inválida.",
    })
    .optional(),
  data_aula: z.coerce.date({
    required_error: "Preencha a data da aula.",
    invalid_type_error: "Data da aula inválida.",
  }),
  quantidade: z.coerce
    .number({
      required_error: "Preencha a quantidade de aulas.",
      invalid_type_error: "Quantidade inválida.",
    })
    .min(1, "A quantidade mínima de aulas é 1."),

  frequencias: z
    .array(AlunoFrequenciaSchema)
    .min(1, "A lista de frequências não pode estar vazia."),
});

export type AlunoFrequenciaInput = z.infer<typeof AlunoFrequenciaSchema>;
export type RegistrarFrequenciaInput = z.infer<
  typeof RegistrarFrequenciaSchema
>;
