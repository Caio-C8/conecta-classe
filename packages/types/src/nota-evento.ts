import z from "zod";
import { Evento } from "./evento";
import { Matricula } from "./matricula";

export interface NotaEvento {
  id: number;
  evento_id: number;
  matricula_id: number;
  nota_obtida: number | null;
  created_at: Date;
  updated_at: Date;

  evento?: Evento;
  matricula?: Matricula;
}

export const AlunoNotaSchema = z.object({
  matricula_id: z.coerce.number({
    required_error: "Preencha o campo matrícula.",
    invalid_type_error: "Matrícula inválida.",
  }),
  nota_obtida: z.coerce
    .number({
      required_error: "Preencha a nota.",
      invalid_type_error: "Nota inválida.",
    })
    .min(0, "A nota não pode ser negativa."),
});

export const RegistrarNotasSchema = z.object({
  notas: z
    .array(AlunoNotaSchema)
    .min(1, "A lista de notas não pode estar vazia."),
});

export type AlunoNotaInput = z.infer<typeof AlunoNotaSchema>;
export type RegistrarNotasInput = z.infer<typeof RegistrarNotasSchema>;
