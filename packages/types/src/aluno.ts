import { Usuario } from "./usuario";

export interface Aluno {
  id: number;
  usuario_id: number;
  usuario: Usuario;
}
