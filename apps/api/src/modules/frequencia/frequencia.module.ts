import { Module } from "@nestjs/common";
import { MatriculaModule } from "../matricula/matricula.module";
import { AulaModule } from "../aula/aula.module";
import { DisciplinaModule } from "../disciplina/disciplina.module";
import { UsuarioModule } from "../usuario/usuario.module";
import { FrequenciaService } from "./frequencia.service";
import { FrequenciaRepository } from "./frequencia.repository";
import { FrequenciaController } from "./frequencia.controller";

@Module({
  imports: [MatriculaModule, AulaModule, DisciplinaModule, UsuarioModule],
  providers: [FrequenciaService, FrequenciaRepository],
  controllers: [FrequenciaController],
  exports: [FrequenciaService, FrequenciaRepository],
})
export class FrequenciaModule {}
