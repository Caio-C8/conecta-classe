import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TipoEvento } from '@repo/types';

export class CreateEventoDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDateString()
  data_evento: string; 

  @IsNumber()
  @IsOptional()
  valor_nota?: number;

  @IsEnum(TipoEvento)
  tipo_evento: TipoEvento;

  @IsNumber()
  turma_id: number;

  @IsNumber()
  disciplina_id: number;
}