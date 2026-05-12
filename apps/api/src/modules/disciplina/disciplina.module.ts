import { Module } from "@nestjs/common";
import { DisciplinaService } from "./disciplina.service";
import { DisciplinaRepository } from "./disciplina.repository";
import { DisciplinaController } from "./disciplina.controller";

@Module({
  imports: [],
  providers: [DisciplinaService, DisciplinaRepository],
  controllers: [DisciplinaController],
  exports: [DisciplinaService, DisciplinaRepository],
})
export class DisciplinaModule {}
