import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AutenticacaoRepository } from "./autenticacao.repository";
import { LoginInput, RespostaLogin } from "@repo/types";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly autenticacaoRepository: AutenticacaoRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dados: LoginInput): Promise<RespostaLogin> {
    const usuario = await this.autenticacaoRepository.getUsuario(dados);

    if (!usuario) {
      throw new UnauthorizedException("Usuário ou senha incorretos.");
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaCorreta) {
      throw new UnauthorizedException("Senha incorreta.");
    }

    const payload = {
      sub: usuario.id,
      usuario: usuario.usuario,
      papel: usuario.papel,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        papel: usuario.papel,
      },
    };
  }
}
