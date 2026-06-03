import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GetUsuario } from "src/common/decorators/get-usuario.decorator";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { EventoService } from "./evento.service";
import { Evento, Papel } from "@repo/types";

@Controller("eventos")
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get("/me/:anoLetivo")
  @Papeis(Papel.ALUNO)
  async getEventosPorTurma(
    @GetUsuario("id") usuarioId: number,
    @Param("anoLetivo", ParseIntPipe) anoLetivo: number,
  ): Promise<Evento[]> {
    return await this.eventoService.getEventosPorTurma(usuarioId, anoLetivo);
  }
}
