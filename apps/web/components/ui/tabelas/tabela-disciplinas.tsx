"use client";

import { Tabela } from "@/components/ui/tabela";
import { COLUNAS_DISCIPLINAS } from "@/constants/colunas-disciplinas";
import { Disciplina, Paginacao } from "@repo/types";

interface TabelaDisciplinasProps {
  disciplinas: Paginacao<Disciplina>;
  isLoading: boolean;
  onMudancaPagina: (pagina: number) => void;
}

export function TabelaDisciplinas({
  disciplinas,
  isLoading,
  onMudancaPagina,
}: TabelaDisciplinasProps) {
  const mostrarTabela =
    isLoading || (disciplinas && disciplinas.dados.length > 0);

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhuma disciplina encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full">
      <Tabela
        colunas={COLUNAS_DISCIPLINAS}
        dados={disciplinas.dados}
        carregando={isLoading}
        metadados={{
          pagina: disciplinas.meta.pagina ? Number(disciplinas.meta.pagina) : 1,
          limite: disciplinas?.meta.limite
            ? Number(disciplinas.meta.limite)
            : 20,
          total: disciplinas?.meta.total ? Number(disciplinas.meta.total) : 0,
          ultimaPagina: disciplinas?.meta.ultima_pagina
            ? Number(disciplinas.meta.ultima_pagina)
            : 1,
        }}
        onMudancaPagina={onMudancaPagina}
        obterChaveLinha={(disciplina) => disciplina.id}
      />
    </div>
  );
}
