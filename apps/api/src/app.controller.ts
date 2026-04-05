import { Controller, Get, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { Papel, type Aluno } from "@repo/types";
import { Publico } from "./common/decorators/publico.decorator";
import { Papeis } from "./common/decorators/papeis.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Publico()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Publico()
  @Get("alunos")
  async getAlunos(): Promise<Aluno[]> {
    return await this.appService.getAlunos();
  }

  @Publico()
  @Post("alunos")
  async createAluno(@Body("usuario") usuario: string): Promise<Aluno> {
    return await this.appService.createAluno(usuario);
  }

  @Get("teste")
  @Papeis(Papel.ALUNO)
  teste() {
    return "teste de papeis e token";
  }
}
