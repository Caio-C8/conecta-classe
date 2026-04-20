import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GetUsuario } from "src/common/decorators/get-usuario.decorator";
import { FrequenciaService } from "./frequencia.service";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { RespostaGetFrequenciaAluno } from "@repo/types";

@Controller("frequencias")
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Get("/me/:anoLetivo")
  @Papeis("ALUNO")
  async getFrequenciaAluno(
    @GetUsuario("id") usuarioId: number,
    @Param("anoLetivo", ParseIntPipe) anoLetivo: number,
  ): Promise<RespostaGetFrequenciaAluno> {
    return await this.frequenciaService.getFrequenciaAluno(
      usuarioId,
      anoLetivo,
    );
  }
}
