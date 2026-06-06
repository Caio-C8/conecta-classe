import { Controller, Get } from "@nestjs/common";
import { GetUsuario } from "src/common/decorators/get-usuario.decorator";
import { MatriculaService } from "./matricula.service";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { Matricula, Papel } from "@repo/types";

@Controller("matriculas")
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Get("/me")
  @Papeis(Papel.ALUNO)
  async getMatriculasPorAluno(
    @GetUsuario("id") usuarioId: number,
  ): Promise<Matricula[]> {
    return await this.matriculaService.getMatriculasPorAluno(usuarioId);
  }
}
