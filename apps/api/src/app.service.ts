import { Injectable } from "@nestjs/common";
import { Aluno, Papel } from "@repo/types";
import { PrismaService } from "./common/prisma/prisma.service";
import { normalizarString } from "@repo/utils";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return "Hello World!";
  }

  async getAlunos(): Promise<Aluno[]> {
    return await this.prisma.aluno.findMany({
      include: {
        usuario: true,
      },
    });
  }

  async createAluno(usuarioName: string): Promise<Aluno> {
    const usuario = await this.prisma.usuario.create({
      data: {
        usuario: usuarioName,
        nome: "Nome Padrão",
        nome_search: normalizarString("Nome Padrão"),
        papel: Papel.ALUNO,
        senha: "senha",
      },
    });

    const aluno = await this.prisma.aluno.create({
      data: {
        usuario: {
          connect: {
            id: usuario.id,
          },
        },
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        usuario: true,
      },
    });

    return aluno;
  }
}
