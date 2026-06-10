import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { UsuarioModule } from "../usuario/usuario.module";
import { TurmaModule } from "../turma/turma.module";
import { DisciplinaModule } from "../disciplina/disciplina.module";

@Module({
  imports: [
    UsuarioModule,
    TurmaModule,
    DisciplinaModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
