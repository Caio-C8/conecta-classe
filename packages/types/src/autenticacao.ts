import { z } from "zod";
import { Papel } from "./enums";

export interface RespostaLogin {
  token: string;
  usuario: {
    id: number;
    nome: string;
    papel: Papel;
    trocar_senha: boolean;
  };
}

export const LoginSchema = z.object({
  usuario: z
    .string({
      required_error: "Preencha o campo usuário.",
      invalid_type_error: "Usuário inválido.",
    })
    .trim()
    .min(1, "Preencha o campo usuário."),

  senha: z
    .string({
      required_error: "Preencha o campo senha.",
      invalid_type_error: "Senha inválida.",
    })
    .trim()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),

  papel: z.nativeEnum(Papel, {
    required_error: "Selecione o seu papel.",
    invalid_type_error: "Papel inválido.",
  }),
});

export const TrocarSenhaSchema = z
  .object({
    senha_atual: z
      .string({
        required_error: "Preencha o campo senha atual.",
        invalid_type_error: "Senha atual inválida.",
      })
      .trim()
      .min(6, { message: "A senha atual deve ter pelo menos 6 caracteres." }),

    nova_senha: z
      .string({
        required_error: "Preencha o campo nova senha.",
        invalid_type_error: "Nova senha inválida.",
      })
      .trim()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),

    confirmar_senha: z
      .string({
        required_error: "Preencha o campo de confirmação.",
        invalid_type_error: "Confirmação de senha inválida.",
      })
      .trim()
      .min(6, { message: "A confirmação deve ter pelo menos 6 caracteres." }),
  })
  .refine((dados) => dados.nova_senha === dados.confirmar_senha, {
    message: "As senhas não coincidem.",
    path: ["confirmar_senha"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type TrocarSenhaInput = z.infer<typeof TrocarSenhaSchema>;
