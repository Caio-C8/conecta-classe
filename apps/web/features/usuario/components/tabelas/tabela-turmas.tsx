"use client";

import { Tabela } from "@/components/ui/tabela";
import { ProfessorTurma } from "@repo/types";
import { COLUNAS_TURMAS } from "../../constants/colunas-turmas";
import { useState } from "react";

interface TabelaTurmasProps {
  turmas: ProfessorTurma[];
  isLoading: boolean;
}

export function TabelaTurmas({ turmas = [], isLoading }: TabelaTurmasProps) {
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const total = turmas.length;
  const ultimaPagina = Math.max(1, Math.ceil(total / limite));

  const turmasPaginadas = turmas.slice((pagina - 1) * limite, pagina * limite);

  const mostrarTabela = isLoading || turmas.length > 0;

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
        dados={turmasPaginadas}
        carregando={isLoading}
        metadados={{
          pagina: pagina,
          limite: limite,
          total: total,
          ultimaPagina: ultimaPagina,
        }}
        obterChaveLinha={(turma) => turma.id}
        onMudancaPagina={setPagina}
      />
    </div>
  );
}
