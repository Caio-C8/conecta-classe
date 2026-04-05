import { Injectable } from "@nestjs/common";
import { LoginInput, Usuario } from "@repo/types";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()
export class AutenticacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsuario(dados: LoginInput): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({
      where: {
        usuario: dados.usuario,
      },
    });
  }
}
