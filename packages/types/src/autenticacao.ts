import { z } from "zod";
import { Papel } from "./usuario";

export interface RespostaLogin {
  token: string;
  usuario: {
    id: number;
    nome: string;
    papel: Papel;
  };
}

export const LoginSchema = z.object({
  usuario: z
    .string({
      message: "Usuário inválido.",
    })
    .min(1, { message: "Preencha o campo usuário." }),

  senha: z
    .string({
      message: "Senha inválida.",
    })
    .min(1, { message: "Preencha o campo senha." }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
