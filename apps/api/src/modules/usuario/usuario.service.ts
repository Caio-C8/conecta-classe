import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUsuarioDto } from "./dtos/create-usuario.dto";
import { Papel, Usuario, UsuarioSemSenha } from "@repo/types";
import { UsuarioRepository } from "./usuario.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async createUsuario(dados: CreateUsuarioDto): Promise<UsuarioSemSenha> {
    const usuario = await this.usuarioRepository.getUsuarioPorUsuario(
      dados.usuario,
    );

    if (usuario) {
      throw new BadRequestException(
        "Já existe um usuário cadastrado com este usuário.",
      );
    }

    dados.senha = await bcrypt.hash(dados.senha, 10);

    let novoUsuario: Usuario | null;

    if (dados.papel === Papel.ADMINISTRADOR) {
      novoUsuario = await this.usuarioRepository.createAdministrador(dados);
    } else if (dados.papel === Papel.PROFESSOR) {
      novoUsuario = await this.usuarioRepository.createProfessor(dados);
    } else {
      novoUsuario = await this.usuarioRepository.createAluno(dados);
    }

    if (!novoUsuario) {
      throw new BadRequestException("Erro ao criar usuário.");
    }

    const { senha, ...novoUsuarioSemSenha } = novoUsuario;

    return novoUsuarioSemSenha;
  }

  async getUsuarioPorId(usuarioId: number): Promise<Usuario | null> {
    return await this.usuarioRepository.getUsuarioPorId(usuarioId);
  }
}
