import z from "zod";
import { Cargo, Papel, StatusTrocarSenha, Status } from "./enums";
import { PaginacaoSchema } from "./paginacao";
import { Administrador } from "./administrador";
import { Professor } from "./professor";
import { Aluno } from "./aluno";

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

  administrador?: Administrador | null;
  aluno?: Aluno | null;
  professor?: Professor | null;
}

export type UsuarioSemSenha = Omit<Usuario, "senha">;

const CreateUsuarioSchemaBase = z.object({
  usuario: z
    .string({
      required_error: "Preencha o campo usuário.",
      invalid_type_error: "Usuário inválido.",
    })
    .trim()
    .min(1, "Preencha o campo usuário."),

  senha: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({
        required_error: "Preencha o campo senha.",
        invalid_type_error: "Senha inválida.",
      })
      .trim()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  ),

  nome: z
    .string({
      required_error: "Preencha o campo nome.",
      invalid_type_error: "Nome inválido.",
    })
    .trim()
    .min(1, "Preencha o campo nome."),

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

export const GetUsuariosSchema = PaginacaoSchema.extend({
  pesquisa: z.string().trim().optional(),

  papel: z.nativeEnum(Papel).optional(),

  status: z.nativeEnum(Status).optional().default(Status.TODOS),

  trocar_senha: z
    .nativeEnum(StatusTrocarSenha)
    .optional()
    .default(StatusTrocarSenha.TODOS),
});

export const UpdateUsuarioSchema = z.object({
  usuario: z
    .string({
      invalid_type_error: "Usuário inválido.",
    })
    .trim()
    .min(1, "Preencha o campo usuário.")
    .optional(),

  senha: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string({
        invalid_type_error: "Senha inválida.",
      })
      .trim()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
      .optional(),
  ),

  nome: z
    .string({
      invalid_type_error: "Nome inválido.",
    })
    .trim()
    .min(1, "Preencha o campo nome.")
    .optional(),

  cargo: z.nativeEnum(Cargo).optional(),

  trocar_senha: z
    .boolean({ invalid_type_error: "Trocar senha inválido." })
    .optional(),
});

export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>;
export type GetUsuariosInput = z.infer<typeof GetUsuariosSchema>;
export type UpdateUsuarioInput = z.infer<typeof UpdateUsuarioSchema>;
