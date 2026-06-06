"use client";

import { Tabela } from "@/components/ui/tabela";
import { ProfessorTurma } from "@repo/types";
import { useState } from "react";
import { COLUNAS_PROFESSORES_TURMA } from "../constants/colunas-professores-turma";

interface TabelaProfessoresTurmaProps {
  professores: ProfessorTurma[];
  isLoading: boolean;
}

export function TabelaProfessoresTurma({
  professores = [],
  isLoading,
}: TabelaProfessoresTurmaProps) {
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const total = professores.length;
  const ultimaPagina = Math.max(1, Math.ceil(total / limite));

  const professoresPaginadas = professores.slice(
    (pagina - 1) * limite,
    pagina * limite,
  );

  const mostrarTabela = isLoading || professores.length > 0;

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhum professor encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full">
      <Tabela
        colunas={COLUNAS_PROFESSORES_TURMA}
        dados={professoresPaginadas}
        carregando={isLoading}
        metadados={{
          pagina: pagina,
          limite: limite,
          total: total,
          ultimaPagina: ultimaPagina,
        }}
        obterChaveLinha={(matricula) => matricula.id}
        onMudancaPagina={setPagina}
      />
    </div>
  );
}
