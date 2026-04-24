import { Module } from "@nestjs/common";
import { EventoService } from "./evento.service";
import { EventoRepository } from "./evento.repository";
import { EventoController } from "./evento.controller";
import { MatriculaModule } from "../matricula/matricula.module";

@Module({
  imports: [MatriculaModule],
  providers: [EventoService, EventoRepository],
  controllers: [EventoController],
  exports: [EventoService, EventoRepository],
})
export class EventoModule {}
