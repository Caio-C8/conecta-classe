import { Turma } from "./turma";
import { Disciplina } from "./disciplina";
import { Professor } from "./professor";
import { NotaEvento } from "./nota-evento";
import { TipoEvento } from "./enums";
import z from "zod";

export interface Evento {
  id: number;
  turma_id: number;
  disciplina_id: number;
  criador_id: number;
  titulo: string;
  descricao: string;
  tipo_evento: TipoEvento;
  valor_nota: number | null;
  data_evento: Date;
  created_at: Date;
  updated_at: Date;

  turma?: Turma;
  disciplina?: Disciplina;
  criador?: Professor;
  nota_evento?: NotaEvento;
}

export const CreateEventoSchema = z.object({
  titulo: z
    .string({
      required_error: "Preencha o campo título.",
      invalid_type_error: "Título inválido.",
    })
    .trim()
    .min(1, "Preencha o campo título."),

  descricao: z
    .string({
      required_error: "Preencha o campo descrição.",
      invalid_type_error: "Descrição inválida.",
    })
    .trim()
    .min(1, "Preencha o campo descrição."),

  data_evento: z.coerce
    .date({
      required_error: "Preencha o campo data do evento.",
      invalid_type_error: "Data do evento inválida.",
    })
    .refine(
      (data) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return data >= hoje;
      },
      { message: "A data de realização do evento não pode ser no passado." },
    ),

  valor_nota: z.coerce
    .number({
      invalid_type_error: "Valor da nota inválido.",
    })
    .optional(),

  tipo_evento: z.nativeEnum(TipoEvento, {
    required_error: "Preencha o campo tipo de evento.",
    invalid_type_error: "Tipo de evento inválido.",
    message: "Tipo de evento inválido.",
  }),

  turma_id: z.coerce.number({
    required_error: "Preencha o campo turma.",
    invalid_type_error: "Turma inválida.",
  }),

  disciplina_id: z.coerce.number({
    required_error: "Preencha o campo disciplina.",
    invalid_type_error: "Disciplina inválida.",
  }),
});

export const UpdateEventoSchema = CreateEventoSchema.partial();

export type CreateEventoInput = z.infer<typeof CreateEventoSchema>;
export type UpdateEventoInput = z.infer<typeof UpdateEventoSchema>;
