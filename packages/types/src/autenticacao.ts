import { z } from "zod";
import { Papel } from "./usuario";

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
});

export const TrocarSenhaSchema = z
  .object({
    nova_senha: z
      .string({
        required_error: "Preencha o campo nova senha.",
        invalid_type_error: "Senha inválida.",
      })
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),

    confirmar_senha: z
      .string({
        required_error: "Preencha o campo de confirmação.",
        invalid_type_error: "Confirmação de senha inválida.",
      })
      .min(6, { message: "A confirmação deve ter pelo menos 6 caracteres." }),
  })
  .refine((dados) => dados.nova_senha === dados.confirmar_senha, {
    message: "As senhas não coincidem.",
    path: ["confirmar_senha"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type TrocarSenhaInput = z.infer<typeof TrocarSenhaSchema>;
