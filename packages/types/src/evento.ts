import { Turma } from "./turma";
import { Disciplina } from "./disciplina";
import { Professor } from "./professor";
import { NotaEvento } from "./nota-evento";
import { TipoEvento } from "./enums";

export interface Evento {
  id: number;
  turma_id: number;
  disciplina_id: number;
  criador_id: number;
  titulo: string;
  descricao: string;
  tipo_evento: TipoEvento;
  valor_nota: number | null;
  data_evento: Date;
  created_at: Date;
  updated_at: Date;

  turma?: Turma;
  disciplina?: Disciplina;
  criador?: Professor;
  nota_evento?: NotaEvento;
}
