"use client";

import { Tabela } from "@/components/ui/tabela";
import { Paginacao, Turma } from "@repo/types";
import { COLUNAS_TURMAS } from "../constants/colunas-turmas";

interface TabelaTurmasProps {
  turmas: Paginacao<Turma>;
  isLoading: boolean;
  onMudancaPagina: (pagina: number) => void;
}

export function TabelaTurmas({
  turmas,
  isLoading,
  onMudancaPagina,
}: TabelaTurmasProps) {
  const mostrarTabela = isLoading || (turmas && turmas.dados.length > 0);

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhuma matrícula encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full">
      <Tabela
        colunas={COLUNAS_TURMAS}
        dados={turmas.dados}
        carregando={isLoading}
        metadados={{
          pagina: turmas.meta.pagina ? Number(turmas.meta.pagina) : 1,
          limite: turmas.meta.limite ? Number(turmas.meta.limite) : 20,
          total: turmas.meta.total ? Number(turmas.meta.total) : 0,
          ultimaPagina: turmas.meta.ultima_pagina
            ? Number(turmas.meta.ultima_pagina)
            : 1,
        }}
        obterChaveLinha={(turma) => turma.id}
        onMudancaPagina={onMudancaPagina}
      />
    </div>
  );
}
