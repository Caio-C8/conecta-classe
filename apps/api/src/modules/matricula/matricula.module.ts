import { forwardRef, Module } from "@nestjs/common";
import { MatriculaService } from "./matricula.service";
import { MatriculaRepository } from "./matricula.repository";
import { RendimentoModule } from "../rendimento/rendimento.module";

@Module({
  imports: [forwardRef(() => RendimentoModule)],
  providers: [MatriculaService, MatriculaRepository],
  controllers: [],
  exports: [MatriculaService, MatriculaRepository],
})
export class MatriculaModule {}
