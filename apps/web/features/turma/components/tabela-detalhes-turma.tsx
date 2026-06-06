"use client";

import { Tabela } from "@/components/ui/tabela";
import { Turma } from "@repo/types";
import { COLUNAS_DETALHES_TURMA } from "../constants/colunas-detalhes-turma";

interface TabelaDetalhesTurmaProps {
  turma: Turma;
  isLoading: boolean;
}

export function TabelaDetalhesTurma({
  turma,
  isLoading,
}: TabelaDetalhesTurmaProps) {
  const mostrarTabela = isLoading || turma;

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhuma turma encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full">
      <Tabela
        colunas={COLUNAS_DETALHES_TURMA}
        dados={turma ? [turma] : []}
        carregando={isLoading}
        metadados={{
          pagina: 0,
          limite: 1,
          total: 0,
          ultimaPagina: 0,
        }}
        obterChaveLinha={(turma) => turma.id}
      />
    </div>
  );
}
