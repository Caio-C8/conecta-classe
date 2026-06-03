import { UsuarioSemSenha } from "./usuario";
import { Matricula } from "./matricula";

export interface Aluno {
  id: number;
  usuario_id: number;

  usuario?: UsuarioSemSenha;
  matriculas?: Matricula[];
}

export interface ResumoAlunos {
  quantidade: number;
}
