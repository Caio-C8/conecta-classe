import z from "zod";

export interface Usuario {
  id: number;
  usuario: string;
  senha: string;
  nome: string;
  nome_search: string;
  papel: Papel;
  trocar_senha: boolean;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const Papel = {
  ALUNO: "ALUNO",
  PROFESSOR: "PROFESSOR",
  ADMINISTRADOR: "ADMINISTRADOR",
} as const;

export type Papel = (typeof Papel)[keyof typeof Papel];

export const Cargo = {
  DIRETORA: "DIRETORA",
  SECRETARIA: "SECRETARIA",
} as const;

export type Cargo = (typeof Cargo)[keyof typeof Cargo];

const CreateUsuarioSchemaBase = z.object({
  usuario: z.string({
    required_error: "Preencha o campo usuário.",
    invalid_type_error: "Usuário inválido.",
  }),

  senha: z
    .string({
      required_error: "Preencha o campo senha.",
      invalid_type_error: "Senha inválida.",
    })
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),

  nome: z.string({
    required_error: "Preencha o campo nome.",
    invalid_type_error: "Nome inválido.",
  }),

  trocar_senha: z.boolean().default(true).optional(),
});

export const CreateUsuarioSchema = z.discriminatedUnion("papel", [
  CreateUsuarioSchemaBase.extend({
    papel: z.literal(Papel.ADMINISTRADOR),
    cargo: z.nativeEnum(Cargo, {
      required_error: "Preencha o campo cargo para o administrador.",
      invalid_type_error: "Cargo inválido.",
    }),
  }),
  CreateUsuarioSchemaBase.extend({
    papel: z.literal(Papel.ALUNO),
  }),
  CreateUsuarioSchemaBase.extend({
    papel: z.literal(Papel.PROFESSOR),
  }),
]);

export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>;
