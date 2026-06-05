"use client";

import { Pesquisa } from "./pesquisa";
import { BotaoToggleFiltro } from "./botao-toggle-filtro";
import { cn } from "@/lib/utils";

interface PesquisaComToggleFiltroProps {
  placeholder?: string;
  isFiltrosVisiveis: boolean;
  onToggleFiltros: () => void;
  className?: string;
}

export function PesquisaComToggleFiltro({
  placeholder,
  isFiltrosVisiveis,
  onToggleFiltros,
  className,
}: PesquisaComToggleFiltroProps) {
  return (
    <div className={cn("flex w-full max-w-lg items-center gap-2", className)}>
      <div className="flex-1">
        <Pesquisa placeholder={placeholder} />
      </div>
      <BotaoToggleFiltro
        isAtivo={isFiltrosVisiveis}
        onClick={onToggleFiltros}
      />
    </div>
  );
}
