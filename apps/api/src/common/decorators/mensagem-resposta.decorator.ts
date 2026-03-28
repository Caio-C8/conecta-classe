import { SetMetadata } from "@nestjs/common";

export const MENSAGEM_RESPOSTA_KEY = "mensagem_resposta";

export const MensagemResposta = (message: string) =>
  SetMetadata(MENSAGEM_RESPOSTA_KEY, message);
