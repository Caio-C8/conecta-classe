import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PersistenceModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PersistenceModule], // Trazendo o Prisma (Tutor) para cá
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}