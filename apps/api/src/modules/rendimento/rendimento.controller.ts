import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GetUsuario } from "src/common/decorators/get-usuario.decorator";
import { RendimentoService } from "./rendimento.service";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { RespostaGetRendimentosAluno } from "@repo/types";

@Controller("rendimentos")
export class RendimentoController {
  constructor(private readonly rendimentoService: RendimentoService) {}

  @Get("/me/:anoLetivo")
  @Papeis("ALUNO")
  async getRendimentosPorAluno(
    @GetUsuario("id") usuarioId: number,
    @Param("anoLetivo", ParseIntPipe) anoLetivo: number,
  ): Promise<RespostaGetRendimentosAluno> {
    return await this.rendimentoService.getRendimentosPorAluno(
      usuarioId,
      anoLetivo,
    );
  }
}
