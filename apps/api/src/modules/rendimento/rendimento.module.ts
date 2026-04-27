import { Module } from "@nestjs/common";
import { RendimentoService } from "./rendimento.service";
import { RendimentoRepository } from "./rendimento.repository";
import { RendimentoController } from "./rendimento.controller";
import { EventoModule } from "../evento/evento.module";
import { MatriculaModule } from "../matricula/matricula.module";

@Module({
  imports: [EventoModule, MatriculaModule],
  providers: [RendimentoService, RendimentoRepository],
  controllers: [RendimentoController],
  exports: [RendimentoService, RendimentoRepository],
})
export class RendimentoModule {}
