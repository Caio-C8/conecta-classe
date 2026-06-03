import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginInput, RespostaLogin, TrocarSenhaInput } from "@repo/types";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsuarioRepository } from "../usuario/usuario.repository";

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dados: LoginInput): Promise<RespostaLogin> {
    const usuario = await this.usuarioRepository.findByUsuario(dados.usuario);

    if (!usuario) {
      throw new UnauthorizedException("Usuário ou senha incorretos.");
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaCorreta) {
      throw new UnauthorizedException("Usuário ou senha incorretos.");
    }

    if (usuario.papel !== dados.papel) {
      throw new UnauthorizedException("Não existe um usuário com este perfil.");
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
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    if (!usuario.trocar_senha) {
      throw new UnauthorizedException(
        "Você não tem permissão para alterar a senha.",
      );
    }

    if (dados.nova_senha !== dados.confirmar_senha) {
      throw new BadRequestException("As senhas não coincidem.");
    }

    const isSenhaAtualCorreta = await bcrypt.compare(
      dados.senha_atual,
      usuario.senha,
    );

    if (!isSenhaAtualCorreta) {
      throw new BadRequestException("Senha atual incorreta.");
    }

    const isNovaSenhaIgualSenhaAtual = await bcrypt.compare(
      dados.nova_senha,
      usuario.senha,
    );

    if (isNovaSenhaIgualSenhaAtual) {
      throw new BadRequestException(
        "A nova senha não pode ser igual à senha atual.",
      );
    }

    dados.nova_senha = await bcrypt.hash(dados.nova_senha, 10);

    const usuarioAtualizado = await this.usuarioRepository.updateSenhaById(
      id,
      dados.nova_senha,
    );

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
