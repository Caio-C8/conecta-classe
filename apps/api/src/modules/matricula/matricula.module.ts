import { Module } from "@nestjs/common";
import { MatriculaService } from "./matricula.service";
import { MatriculaRepository } from "./matricula.repository";

@Module({
  imports: [],
  providers: [MatriculaService, MatriculaRepository],
  controllers: [],
  exports: [MatriculaService, MatriculaRepository],
})
export class MatriculaModule {}
