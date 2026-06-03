"use client";

import { useState } from "react";
import { Tabela } from "@/components/ui/tabela";
import { COLUNAS_DISCIPLINAS } from "@/constants/colunas-disciplinas";
import { useDisciplinas } from "@/hooks/use-disciplinas";
import { Status } from "@repo/types";

export function TabelaDisciplinas() {
  const [pagina, setPagina] = useState(1);
  const limite = 20;

  const { data: resposta, isLoading } = useDisciplinas({
    pagina,
    limite,
    status: Status.TODOS,
  });

  const disciplinasPaginadas = resposta?.dados;

  const mostrarTabela =
    isLoading ||
    (disciplinasPaginadas && disciplinasPaginadas.dados.length > 0);

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhuma disciplina encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mt-6">
      <Tabela
        colunas={COLUNAS_DISCIPLINAS}
        dados={disciplinasPaginadas?.dados}
        carregando={isLoading}
        metadados={{
          pagina: disciplinasPaginadas?.meta.pagina
            ? Number(disciplinasPaginadas.meta.pagina)
            : 1,
          limite: disciplinasPaginadas?.meta.limite
            ? Number(disciplinasPaginadas.meta.limite)
            : limite,
          total: disciplinasPaginadas?.meta.total
            ? Number(disciplinasPaginadas.meta.total)
            : 0,
          ultimaPagina: disciplinasPaginadas?.meta.ultima_pagina
            ? Number(disciplinasPaginadas.meta.ultima_pagina)
            : 1,
        }}
        onMudancaPagina={(novaPagina) => setPagina(novaPagina)}
        obterChaveLinha={(disciplina) => disciplina.id}
      />
    </div>
  );
}
