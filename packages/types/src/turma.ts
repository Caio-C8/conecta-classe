import { NivelEnsino, SituacaoTurma, Status } from "./enums";
import { ProfessorTurma } from "./professor-turma";
import { Matricula } from "./matricula";
import { Aula } from "./aula";
import { Evento } from "./evento";
import z from "zod";
import { PaginacaoSchema } from "./paginacao";

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

export interface ResumoTurmas {
  quantidade: number;
}

export const CreateTurmaSchema = z.object({
  identificacao: z
    .string({
      required_error: "Preencha o campo identificação.",
      invalid_type_error: "Identificação inválida.",
    })
    .trim()
    .min(1, "Preencha o campo identificação."),

  serie: z.coerce
    .number({
      required_error: "Preencha o campo série.",
      invalid_type_error: "Série inválida.",
    })
    .min(1, { message: "A série deve ser no mínimo no 1° ano." }),

  nivel_ensino: z.nativeEnum(NivelEnsino, {
    message: "Nível de ensino inválido.",
  }),

  sala: z
    .string({
      required_error: "Preencha o campo sala.",
      invalid_type_error: "Sala inválida.",
    })
    .trim()
    .min(1, "Preencha o campo sala."),

  ano_letivo: z.coerce
    .number({
      required_error: "Preencha o campo ano letivo.",
      invalid_type_error: "Ano letivo inválido.",
    })
    .min(new Date().getFullYear(), {
      message: "O ano letivo deve ser no mínimo o ano atual.",
    }),
});

export const UpdateTurmaSchema = CreateTurmaSchema.partial();

export const GetTurmasSchema = PaginacaoSchema.extend({
  pesquisa: z.string().trim().optional(),

  status: z.nativeEnum(Status).optional().default(Status.TODOS),

  nivel_ensino: z.nativeEnum(NivelEnsino).optional(),

  serie: z.coerce.number().optional(),

  ano_letivo: z.coerce.number().optional(),

  situacao: z.nativeEnum(SituacaoTurma).optional(),
});

export const VincularEDesvincularProfessorSchema = z.object({
  professorId: z.coerce.number({
    required_error: "Preencha o campo professor.",
    invalid_type_error: "Professor inválido.",
  }),

  disciplinaId: z.coerce.number({
    required_error: "Preencha o campo disciplina.",
    invalid_type_error: "Disciplina inválido.",
  }),
});

export const VincularEDesvincularAlunoSchema = z.object({
  alunoId: z.coerce.number({
    required_error: "Preencha o campo aluno.",
    invalid_type_error: "Aluno inválido.",
  }),
});

export type CreateTurmaInput = z.infer<typeof CreateTurmaSchema>;
export type UpdateTurmaInput = z.infer<typeof UpdateTurmaSchema>;
export type GetTurmasInput = z.infer<typeof GetTurmasSchema>;
export type VincularEDesvincularProfessorInput = z.infer<
  typeof VincularEDesvincularProfessorSchema
>;
export type VincularEDesvincularAlunoInput = z.infer<
  typeof VincularEDesvincularAlunoSchema
>;
