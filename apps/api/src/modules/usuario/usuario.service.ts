import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUsuarioDto } from "./dtos/create-usuario.dto";
import { Papel, Usuario } from "@repo/types";
import { UsuarioRepository } from "./usuario.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async createUsuario(dados: CreateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.getUsuarioPorUsuario(
      dados.usuario,
    );

    if (usuario) {
      throw new BadRequestException(
        "Já existe um usuário cadastrado com este usuário.",
      );
    }

    dados.senha = await bcrypt.hash(dados.senha, 10);

    if (dados.papel === Papel.ADMINISTRADOR) {
      const usuario = await this.usuarioRepository.createAdministrador(dados);

      if (!usuario) {
        throw new BadRequestException("Erro ao criar usuário administrador.");
      }

      return usuario;
    } else if (dados.papel === Papel.PROFESSOR) {
      return await this.usuarioRepository.createProfessor(dados);
    } else {
      return await this.usuarioRepository.createAluno(dados);
    }
  }
}
