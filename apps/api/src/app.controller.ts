import { Controller, Get, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import type { Aluno } from "@repo/types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("alunos")
  async getAlunos(): Promise<Aluno[]> {
    return await this.appService.getAlunos();
  }

  @Post("alunos")
  async createAluno(@Body("usuario") usuario: string): Promise<Aluno> {
    return await this.appService.createAluno(usuario);
  }
}
