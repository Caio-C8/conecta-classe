import { Badge } from "@/components/ui/badge";
import { Coluna } from "@/components/ui/tabela";
import { NivelEnsino, ProfessorTurma, SituacaoTurma } from "@repo/types";

export const COLUNAS_TURMAS: Coluna<ProfessorTurma>[] = [
  {
    cabecalho: "Identificação",
    celula: (professorTurma) => professorTurma.turma?.identificacao,
  },
  {
    cabecalho: "Série",
    celula: (professorTurma) => `${professorTurma.turma?.serie}º`,
  },
  {
    cabecalho: "Nível de ensino",
    celula: (professorTurma) => {
      switch (professorTurma.turma?.nivel_ensino) {
        case NivelEnsino.FUNDAMENTAL_1:
          return "Fundamental I";
        case NivelEnsino.FUNDAMENTAL_2:
          return "Fundamental II";
        case NivelEnsino.MEDIO:
          return "Ensino Médio";
      }
    },
  },
  {
    cabecalho: "Sala",
    celula: (professorTurma) => professorTurma.turma?.sala,
  },
  {
    cabecalho: "Status",
    celula: (professorTurma) => {
      return professorTurma.turma?.deleted_at ? (
        <Badge variant="destructive" className="text-sm">
          Inativa
        </Badge>
      ) : (
        <Badge variant="success" className="text-sm">
          Ativa
        </Badge>
      );
    },
  },
  {
    cabecalho: "Ano letivo",
    celula: (professorTurma) => professorTurma.turma?.ano_letivo,
  },
  {
    cabecalho: "Situação",
    celula: (professorTurma) => {
      switch (professorTurma.turma?.situacao) {
        case SituacaoTurma.ENCERRADA:
          return "Encerrada";
        case SituacaoTurma.EM_ANDAMENTO:
          return "Em Andamento";
      }
    },
  },
];
