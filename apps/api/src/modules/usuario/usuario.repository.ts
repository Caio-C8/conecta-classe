import { Injectable } from "@nestjs/common";
import { CreateUsuarioInput, Papel, Usuario } from "@repo/types";
import { normalizarString } from "@repo/utils";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAdministrador(
    dados: CreateUsuarioInput,
  ): Promise<Usuario | null> {
    if (dados.papel !== Papel.ADMINISTRADOR) {
      return null;
    }

    return this.prisma.usuario.create({
      data: {
        usuario: dados.usuario,
        senha: dados.senha,
        nome: dados.nome,
        nome_search: normalizarString(dados.nome),
        papel: dados.papel,
        trocar_senha: dados.trocar_senha,
        administrador: {
          create: {
            cargo: dados.cargo,
          },
        },
      },
      include: {
        administrador: true,
      },
    });
  }

  async createProfessor(dados: CreateUsuarioInput): Promise<Usuario> {
    return this.prisma.usuario.create({
      data: {
        usuario: dados.usuario,
        senha: dados.senha,
        nome: dados.nome,
        nome_search: normalizarString(dados.nome),
        papel: dados.papel,
        trocar_senha: dados.trocar_senha,
        professor: {
          create: {},
        },
      },
    });
  }

  async createAluno(dados: CreateUsuarioInput): Promise<Usuario> {
    return this.prisma.usuario.create({
      data: {
        usuario: dados.usuario,
        senha: dados.senha,
        nome: dados.nome,
        nome_search: normalizarString(dados.nome),
        papel: dados.papel,
        trocar_senha: dados.trocar_senha,
        aluno: {
          create: {},
        },
      },
    });
  }

  async updateSenhaUsuario(id: number, novaSenha: string): Promise<Usuario> {
    return await this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        senha: novaSenha,
        trocar_senha: false,
      },
    });
  }

  async getUsuarioPorUsuario(usuario: string): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: { usuario },
    });
  }

  async getUsuarioPorId(id: number): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: {
        id,
      },
    });
  }
}
