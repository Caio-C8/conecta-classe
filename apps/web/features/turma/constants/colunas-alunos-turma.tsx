import { Badge } from "@/components/ui/badge";
import { Coluna } from "@/components/ui/tabela";
import { Matricula, StatusMatricula } from "@repo/types";
import { BotaoDesvincularAluno } from "../components/botao-desvincular-aluno";
import { Button } from "@/components/ui/button";

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

export const COLUNAS_ALUNOS_TURMA: Coluna<Matricula>[] = [
  {
    cabecalho: "Nome do aluno",
    celula: (matricula) => matricula.aluno?.usuario?.nome,
  },
  {
    cabecalho: "Usuário",
    celula: (matricula) => matricula.aluno?.usuario?.usuario,
  },
  {
    cabecalho: "Status da matrícula",
    celula: (matricula) => renderizarStatusMatricula(matricula.status),
  },
  {
    cabecalho: "Status do usuário",
    celula: (matricula) => {
      return matricula.aluno?.usuario?.deleted_at ? (
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
    celula: (matricula) =>
      matricula.status !== StatusMatricula.CURSANDO ? (
        <Button variant="link" className="link text-muted-foreground!" disabled>
          Desvincular
        </Button>
      ) : (
        <BotaoDesvincularAluno
          id={matricula.turma_id}
          dados={{
            alunoId: matricula.aluno_id,
          }}
        />
      ),
  },
];
