import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coluna } from "@/components/ui/tabela";
import { Disciplina } from "@repo/types";

export const COLUNAS_DISCIPLINAS: Coluna<Disciplina>[] = [
  {
    cabecalho: "Nome",
    celula: (disciplina) => disciplina.nome,
  },
  {
    cabecalho: "Status",
    celula: (disciplina) => {
      return disciplina.deleted_at ? (
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
    cabecalho: "",
    celula: () => (
      <Button variant="link" className="link cursor-pointer">
        Editar
      </Button>
    ),
  },
];
