import { IsArray, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AlunoNotaDto {
  @IsNumber() 
  matricula_id: number;
  
  @IsNumber() 
  @Min(0) 
  nota_obtida: number;
}

export class RegistrarNotasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlunoNotaDto)
  notas: AlunoNotaDto[];
}