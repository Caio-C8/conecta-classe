import { Badge } from "@/components/ui/badge";
import { Coluna } from "@/components/ui/tabela";
import { Matricula, NivelEnsino, StatusMatricula } from "@repo/types";

const renderizarStatusMatricula = (status: StatusMatricula) => {
  switch (status) {
    case StatusMatricula.CURSANDO:
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent shadow-none">
          Cursando
        </Badge>
      );
    case StatusMatricula.APROVADO:
      return (
        <Badge variant="success" className="shadow-none">
          Aprovado
        </Badge>
      );
    case StatusMatricula.REPROVADO:
      return (
        <Badge variant="destructive" className="shadow-none">
          Reprovado
        </Badge>
      );
    case StatusMatricula.TRANSFERIDO:
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground border-dashed"
        >
          Transferido
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const COLUNAS_MATRICULAS: Coluna<Matricula>[] = [
  {
    cabecalho: "Ano letivo",
    celula: (matricula) => matricula.ano_letivo,
  },
  {
    cabecalho: "Status",
    celula: (matricula) => renderizarStatusMatricula(matricula.status),
  },
  {
    cabecalho: "Turma",
    celula: (matricula) => matricula.turma?.identificacao,
  },
  {
    cabecalho: "Série",
    celula: (matricula) => `${matricula.turma?.serie}º`,
  },
  {
    cabecalho: "Nível de ensino",
    celula: (matricula) => {
      switch (matricula.turma?.nivel_ensino) {
        case NivelEnsino.FUNDAMENTAL_1:
          return "Fundamental I";
        case NivelEnsino.FUNDAMENTAL_2:
          return "Fundamental II";
        case NivelEnsino.MEDIO:
          return "Ensino Médio";
      }
    },
  },
];
