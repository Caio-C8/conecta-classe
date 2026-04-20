import { Usuario } from "./usuario";
import { Matricula } from "./matricula";

export interface Aluno {
  id: number;
  usuario_id: number;

  usuario?: Usuario;
  matriculas?: Matricula[];
}
