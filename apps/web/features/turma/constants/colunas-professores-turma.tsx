import { Badge } from "@/components/ui/badge";
import { Coluna } from "@/components/ui/tabela";
import { ProfessorTurma } from "@repo/types";
import { BotaoDesvincularProfessor } from "../components/botao-desvincular-professor";

export const COLUNAS_PROFESSORES_TURMA: Coluna<ProfessorTurma>[] = [
  {
    cabecalho: "Nome do professor",
    celula: (professorTurma) => professorTurma.professor?.usuario?.nome,
  },
  {
    cabecalho: "Usuário",
    celula: (professorTurma) => professorTurma.professor?.usuario?.usuario,
  },
  {
    cabecalho: "Disciplina",
    celula: (professorTurma) => professorTurma.disciplina?.nome,
  },
  {
    cabecalho: "Status do professor",
    celula: (professorTurma) => {
      return professorTurma.professor?.usuario?.deleted_at ? (
        <Badge variant="destructive" className="text-sm">
          Inativo
        </Badge>
      ) : (
        <Badge variant="success" className="text-sm">
          Ativo
        </Badge>
      );
    },
  },
  {
    cabecalho: "",
    celula: (professorTurma) => (
      <BotaoDesvincularProfessor
        id={professorTurma.turma_id}
        dados={{
          professorId: professorTurma.professor_id,
          disciplinaId: professorTurma.disciplina_id,
        }}
      />
    ),
  },
];
