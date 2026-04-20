import { Evento } from "./evento";
import { Matricula } from "./matricula";

export interface NotaEvento {
  id: number;
  evento_id: number;
  matricula_id: number;
  nota_obtida: number | null;
  created_at: Date;
  updated_at: Date;

  evento?: Evento;
  matricula?: Matricula;
}
