import { Cargo } from "./enums";
import { Usuario } from "./usuario";

export interface Administrador {
  id: number;
  usuario_id: number;
  cargo: Cargo;

  usuario?: Usuario;
}
