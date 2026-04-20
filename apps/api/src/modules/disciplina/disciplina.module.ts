import { Module } from "@nestjs/common";
import { DisciplinaService } from "./disciplina.service";
import { DisciplinaRepository } from "./disciplina.repository";

@Module({
  imports: [],
  providers: [DisciplinaService, DisciplinaRepository],
  controllers: [],
  exports: [DisciplinaService, DisciplinaRepository],
})
export class DisciplinaModule {}
