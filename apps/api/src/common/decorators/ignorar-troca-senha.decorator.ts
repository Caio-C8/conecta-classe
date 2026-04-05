import { SetMetadata } from "@nestjs/common";

export const IGNORAR_TROCA_SENHA_KEY = "ignorarTrocaSenha";
export const IgnorarTrocaSenha = () =>
  SetMetadata(IGNORAR_TROCA_SENHA_KEY, true);
