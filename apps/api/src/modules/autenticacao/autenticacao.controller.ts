import { Body, Controller, Post } from "@nestjs/common";
import { AutenticacaoService } from "./autenticacao.service";
import { LoginDto } from "./dtos/login.dto";
import { RespostaLogin } from "@repo/types";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { Publico } from "src/common/decorators/publico.decorator";

@Controller("autenticacao")
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Publico()
  @Post("login")
  @MensagemResposta("Login realizado com sucesso.")
  async login(@Body() dados: LoginDto): Promise<RespostaLogin> {
    return this.autenticacaoService.login(dados);
  }
}
