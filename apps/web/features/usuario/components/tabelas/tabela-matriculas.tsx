"use client";

import { Tabela } from "@/components/ui/tabela";
import { Matricula } from "@repo/types";
import { COLUNAS_MATRICULAS } from "../../constants/colunas-matriculas";
import { useState } from "react";

interface TabelaMatriculasProps {
  matriculas: Matricula[];
  isLoading: boolean;
}

export function TabelaMatriculas({
  matriculas = [],
  isLoading,
}: TabelaMatriculasProps) {
  const [pagina, setPagina] = useState(1);
  const limite = 5;
  const total = matriculas.length;
  const ultimaPagina = Math.max(1, Math.ceil(total / limite));

  const matriculasPaginadas = matriculas.slice(
    (pagina - 1) * limite,
    pagina * limite,
  );

  const mostrarTabela = isLoading || matriculas.length > 0;

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
        colunas={COLUNAS_MATRICULAS}
        dados={matriculasPaginadas}
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
