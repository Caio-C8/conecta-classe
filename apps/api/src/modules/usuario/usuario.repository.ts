import { Injectable } from "@nestjs/common";
import { Prisma } from "@repo/database";
import {
  CreateUsuarioInput,
  GetUsuariosInput,
  Paginacao,
  Papel,
  StatusTrocarSenha,
  StatusUsuario,
  UpdateUsuarioInput,
  Usuario,
} from "@repo/types";
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

  async updateUsuario(
    id: number,
    dados: UpdateUsuarioInput & { nome_search?: string },
  ): Promise<Usuario> {
    const dadosParaAtualizar: Prisma.UsuarioUpdateInput = {
      usuario: dados.usuario,
      senha: dados.senha,
      nome: dados.nome,
      nome_search: dados.nome_search,
      trocar_senha: dados.trocar_senha,
    };

    if (dados.cargo) {
      dadosParaAtualizar.administrador = {
        update: {
          cargo: dados.cargo,
        },
      };
    }

    return await this.prisma.usuario.update({
      where: { id },
      data: dadosParaAtualizar,
      include: {
        administrador: true,
        aluno: true,
        professor: true,
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

  async getAllUsuarios(params: GetUsuariosInput): Promise<Paginacao<Usuario>> {
    const { limite, pagina, status, papel, pesquisa, trocar_senha } = params;

    const skip = (pagina - 1) * limite;

    const where: Prisma.UsuarioWhereInput = {
      deleted_at:
        status === StatusUsuario.ATIVO
          ? null
          : status === StatusUsuario.INATIVO
            ? { not: null }
            : undefined,
    };

    if (pesquisa) {
      where.OR = [
        { nome_search: { contains: normalizarString(pesquisa) } },
        { usuario: { contains: pesquisa } },
      ];
    }

    if (papel) {
      where.papel = {
        equals: papel,
      };
    }

    if (trocar_senha) {
      where.trocar_senha = {
        equals:
          trocar_senha === StatusTrocarSenha.SIM
            ? true
            : trocar_senha === StatusTrocarSenha.NAO
              ? false
              : undefined,
      };
    }

    const [total, dados] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        include: {
          administrador: true,
          aluno: true,
          professor: true,
        },
        orderBy: { id: "desc" },
      }),
    ]);

    return {
      dados,
      meta: {
        total,
        pagina,
        limite,
        ultima_pagina: Math.ceil(total / limite),
      },
    };
  }

  async getUsuarioPorUsuario(usuario: string): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: { usuario },
      include: {
        administrador: true,
        aluno: true,
        professor: true,
      },
    });
  }

  async getUsuarioPorId(id: number): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      include: {
        administrador: true,
        aluno: true,
        professor: true,
      },
    });
  }
}
