"use client";

import { useState } from "react";
import { PesquisaComToggleFiltro } from "./pesquisa-com-toggle-filtro";
import { Filtro, ConfigCampoFiltro } from "./filtro";

interface PesquisaEFiltroProps<T> {
  placeholderPesquisa?: string;
  camposFiltro?: ConfigCampoFiltro<T>[];
  className?: string;
}

export function PesquisaEFiltro<T extends Record<string, any>>({
  placeholderPesquisa = "Pesquisar...",
  camposFiltro = [],
  className,
}: PesquisaEFiltroProps<T>) {
  const [isFiltrosVisiveis, setIsFiltrosVisiveis] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4 max-w-7xl items-center">
      <PesquisaComToggleFiltro
        placeholder={placeholderPesquisa}
        isFiltrosVisiveis={isFiltrosVisiveis}
        onToggleFiltros={() => setIsFiltrosVisiveis(!isFiltrosVisiveis)}
        className={className}
      />

      {isFiltrosVisiveis && camposFiltro.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <Filtro campos={camposFiltro} />
        </div>
      )}
    </div>
  );
}
