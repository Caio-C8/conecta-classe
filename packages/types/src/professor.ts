import { UsuarioSemSenha } from "./usuario";
import { ProfessorTurma } from "./professor-turma";
import { Aula } from "./aula";
import { Evento } from "./evento";

export interface Professor {
  id: number;
  usuario_id: number;

  usuario?: UsuarioSemSenha;
  turmas?: ProfessorTurma[];
  aulas?: Aula[];
  eventos?: Evento[];
}
