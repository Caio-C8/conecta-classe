import { forwardRef, Module } from "@nestjs/common";
import { MatriculaService } from "./matricula.service";
import { MatriculaRepository } from "./matricula.repository";
import { RendimentoModule } from "../rendimento/rendimento.module";
import { UsuarioModule } from "../usuario/usuario.module";
import { MatriculaController } from "./matricula.controller";

@Module({
  imports: [forwardRef(() => RendimentoModule), UsuarioModule],
  providers: [MatriculaService, MatriculaRepository],
  controllers: [MatriculaController],
  exports: [MatriculaService, MatriculaRepository],
})
export class MatriculaModule {}
