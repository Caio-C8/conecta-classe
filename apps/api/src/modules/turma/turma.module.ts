import { Module } from "@nestjs/common";
import { TurmaService } from "./turma.service";
import { TurmaRepository } from "./turma.repository";
import { TurmaController } from "./turma.controller";
import { MatriculaModule } from "../matricula/matricula.module";
import { FrequenciaModule } from "../frequencia/frequencia.module";
import { RendimentoModule } from "../rendimento/rendimento.module";
import { UsuarioModule } from "../usuario/usuario.module";
import { DisciplinaModule } from "../disciplina/disciplina.module";

@Module({
  imports: [
    MatriculaModule,
    FrequenciaModule,
    RendimentoModule,
    UsuarioModule,
    DisciplinaModule,
  ],
  providers: [TurmaService, TurmaRepository],
  controllers: [TurmaController],
  exports: [TurmaService, TurmaRepository],
})
export class TurmaModule {}
