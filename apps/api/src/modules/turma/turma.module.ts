import { Module } from "@nestjs/common";
import { TurmaService } from "./turma.service";
import { TurmaRepository } from "./turma.repository";
import { TurmaController } from "./turma.controller";

@Module({
  imports: [],
  providers: [TurmaService, TurmaRepository],
  controllers: [TurmaController],
  exports: [TurmaService, TurmaRepository],
})
export class TurmaModule {}
