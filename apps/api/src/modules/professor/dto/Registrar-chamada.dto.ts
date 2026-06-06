import { IsArray, IsDateString, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AlunoFrequenciaDto {
  @IsNumber() matricula_id: number;
  @IsNumber() @Min(0) numero_faltas: number;
}

export class RegistrarChamadaDto {
  @IsNumber() turma_id: number;
  @IsNumber() disciplina_id: number;
  @IsDateString() data_aula: string;
  @IsNumber() @Min(1) quantidade: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlunoFrequenciaDto)
  frequencias: AlunoFrequenciaDto[];
}