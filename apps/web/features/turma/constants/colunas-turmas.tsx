import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coluna } from "@/components/ui/tabela";
import { NivelEnsino, SituacaoTurma, Turma } from "@repo/types";
import Link from "next/link";

export const COLUNAS_TURMAS: Coluna<Turma>[] = [
  {
    cabecalho: "Identificação",
    celula: (turma) => turma.identificacao,
  },
  {
    cabecalho: "Série",
    celula: (turma) => `${turma.serie}º ano`,
  },
  {
    cabecalho: "Nível de ensino",
    celula: (turma) => {
      switch (turma.nivel_ensino) {
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
    celula: (turma) => turma.sala,
  },
  {
    cabecalho: "Status",
    celula: (turma) => {
      return turma.deleted_at ? (
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
    celula: (turma) => turma.ano_letivo,
  },
  {
    cabecalho: "Situação",
    celula: (turma) => {
      switch (turma.situacao) {
        case SituacaoTurma.ENCERRADA:
          return "Encerrada";
        case SituacaoTurma.EM_ANDAMENTO:
          return "Em Andamento";
      }
    },
  },
  {
    cabecalho: "",
    celula: (turma) => (
      <Link href={`/admin/turmas/${turma.id}`}>
        <Button variant="link" className="link cursor-pointer">
          Gerenciar
        </Button>
      </Link>
    ),
  },
];
