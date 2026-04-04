import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AutenticacaoRepository } from "./autenticacao.repository";
import { LoginInput, RespostaLogin, TrocarSenhaInput } from "@repo/types";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly autenticacaoRepository: AutenticacaoRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dados: LoginInput): Promise<RespostaLogin> {
    const usuario =
      await this.autenticacaoRepository.getUsuarioPorUsuario(dados);

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
      trocar_senha: usuario.trocar_senha,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        papel: usuario.papel,
        trocar_senha: usuario.trocar_senha,
      },
    };
  }

  async trocarSenha(
    id: number,
    dados: TrocarSenhaInput,
  ): Promise<RespostaLogin> {
    if (dados.nova_senha !== dados.confirmar_senha) {
      throw new UnauthorizedException("As senhas não coincidem.");
    }

    const usuario = await this.autenticacaoRepository.getUsuarioPorId(id);

    if (!usuario) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    if (!usuario.trocar_senha) {
      throw new UnauthorizedException(
        "Você não tem permissão para alterar a senha.",
      );
    }

    dados.nova_senha = await bcrypt.hash(dados.nova_senha, 10);

    const usuarioAtualizado =
      await this.autenticacaoRepository.updateSenhaUsuario(id, dados);

    const payload = {
      sub: usuarioAtualizado.id,
      usuario: usuarioAtualizado.usuario,
      papel: usuarioAtualizado.papel,
      trocar_senha: usuarioAtualizado.trocar_senha,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        papel: usuarioAtualizado.papel,
        trocar_senha: usuarioAtualizado.trocar_senha,
      },
    };
  }
}
