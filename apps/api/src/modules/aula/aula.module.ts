import { Module } from "@nestjs/common";
import { AulaService } from "./aula.service";
import { AulaRepository } from "./aula.repository";

@Module({
  imports: [],
  providers: [AulaService, AulaRepository],
  controllers: [],
  exports: [AulaService, AulaRepository],
})
export class AulaModule {}
