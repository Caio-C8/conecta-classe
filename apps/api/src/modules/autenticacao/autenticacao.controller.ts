import { Body, Controller, Patch, Post, Request } from "@nestjs/common";
import { AutenticacaoService } from "./autenticacao.service";
import { LoginDto } from "./dtos/login.dto";
import { RespostaLogin } from "@repo/types";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { Publico } from "src/common/decorators/publico.decorator";
import { TrocarSenhaDto } from "./dtos/trocar-senha.dto";
import { IgnorarTrocaSenha } from "src/common/decorators/ignorar-troca-senha.decorator";
import { UsuarioLogado } from "src/common/decorators/usuario-logado.decorator";

@Controller("autenticacao")
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Publico()
  @Post("login")
  @MensagemResposta("Login realizado com sucesso.")
  async login(@Body() dados: LoginDto): Promise<RespostaLogin> {
    return this.autenticacaoService.login(dados);
  }

  @Patch("trocar/senha")
  @IgnorarTrocaSenha()
  @MensagemResposta("Senha alterada com sucesso.")
  async trocarSenha(
    @UsuarioLogado("id") usuarioId: number,
    @Body() dados: TrocarSenhaDto,
  ): Promise<RespostaLogin> {
    return this.autenticacaoService.trocarSenha(usuarioId, dados);
  }
}
