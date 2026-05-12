import { ProfessorTurma } from "./professor-turma";
import { Aula } from "./aula";
import { Evento } from "./evento";
import { RendimentoDisciplina } from "./rendimento-disciplina";
import z from "zod";

export interface Disciplina {
  id: number;
  nome: string;
  nome_search: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  professores?: ProfessorTurma[];
  aulas?: Aula[];
  eventos?: Evento[];
  rendimentos?: RendimentoDisciplina[];
}

export const CreateDisciplinaSchema = z.object({
  nome: z.string({
    required_error: "Preencha o campo nome.",
    invalid_type_error: "Nome inválido.",
  }),
});

export type CreateDisciplinaInput = z.infer<typeof CreateDisciplinaSchema>;
