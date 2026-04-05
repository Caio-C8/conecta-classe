import { Injectable } from "@nestjs/common";
import { LoginInput, TrocarSenhaInput, Usuario } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class AutenticacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateSenhaUsuario(
    id: number,
    dados: TrocarSenhaInput,
  ): Promise<Usuario> {
    return await this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        senha: dados.nova_senha,
        trocar_senha: false,
      },
    });
  }

  async getUsuarioPorUsuario(dados: LoginInput): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: {
        usuario: dados.usuario,
      },
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
