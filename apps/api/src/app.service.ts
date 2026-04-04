import { Injectable } from "@nestjs/common";
import { Aluno, Papel } from "@repo/types";
import { PrismaService } from "./common/prisma/prisma.service";
import { normalizarString } from "@repo/utils";
import * as bcrypt from "bcrypt";

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
        senha: await bcrypt.hash("senha123@", 10),
      },
    });

    const aluno = await this.prisma.aluno.create({
      data: {
        usuario: {
          connect: {
            id: usuario.id,
          },
        },
      },
      include: {
        usuario: true,
      },
    });

    return aluno;
  }
}
