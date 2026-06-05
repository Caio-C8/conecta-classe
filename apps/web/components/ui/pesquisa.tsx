"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { useFiltroUrl } from "@/hooks/use-filtro-url";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PesquisaProps {
  placeholder?: string;
  className?: string;
}

export function Pesquisa({
  placeholder = "Pesquisar...",
  className,
}: PesquisaProps) {
  const { atualizarParametros, parametros } = useFiltroUrl();
  const [valor, setValor] = useState(parametros.pesquisa || "");

  const valorDebounced = useDebounce(valor, 500);
  const isMontagemInicial = useRef(true);

  useEffect(() => {
    setValor(parametros.pesquisa || "");
  }, [parametros.pesquisa]);

  useEffect(() => {
    if (isMontagemInicial.current) {
      isMontagemInicial.current = false;
      return;
    }

    if (valorDebounced !== (parametros.pesquisa || "")) {
      atualizarParametros({ pesquisa: valorDebounced || undefined });
    }
  }, [valorDebounced, atualizarParametros, parametros.pesquisa]);

  return (
    <div className={cn("relative w-full", className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9 h-10 text-[16px] sm:text-sm bg-card"
        placeholder={placeholder}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      {valor && (
        <X
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setValor("")}
        />
      )}
    </div>
  );
}
