import { Usuario } from "./usuario";

export interface Aluno {
  id: number;
  usuario_id: number;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  usuario: Usuario;
}
