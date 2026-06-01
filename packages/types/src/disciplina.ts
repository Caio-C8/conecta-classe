import { ProfessorTurma } from "./professor-turma";
import { Aula } from "./aula";
import { Evento } from "./evento";
import { RendimentoDisciplina } from "./rendimento-disciplina";
import z from "zod";
import { PaginacaoSchema } from "./paginacao";
import { Status } from "./enums";

export interface Disciplina {
  id: number;
  nome: string;
  nome_search: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  professores?: ProfessorTurma[];
  aulas?: Aula[];
  eventos?: Evento[];
  rendimentos?: RendimentoDisciplina[];
}

export interface ResumoDisciplinas {
  quantidade: number;
}

export const CreateDisciplinaSchema = z.object({
  nome: z.string({
    required_error: "Preencha o campo nome.",
    invalid_type_error: "Nome inválido.",
  }),
});

export const UpdateDisciplinaSchema = z.object({
  nome: z
    .string({
      invalid_type_error: "Nome inválido.",
    })
    .optional(),
});

export const GetDisciplinasSchema = PaginacaoSchema.extend({
  pesquisa: z.string().optional(),

  status: z.nativeEnum(Status).optional().default(Status.TODOS),
});

export type CreateDisciplinaInput = z.infer<typeof CreateDisciplinaSchema>;
export type GetDisciplinasInput = z.infer<typeof GetDisciplinasSchema>;
export type UpdateDisciplinaInput = z.infer<typeof UpdateDisciplinaSchema>;
