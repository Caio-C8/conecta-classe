"use client";

import { useAnoLetivo } from "@/features/professor/contexts/ano-letivo-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface CabecalhoProfessorProps {
  titulo: string;
  descricao?: string;
}

export function CabecalhoProfessor({
  titulo,
  descricao,
}: CabecalhoProfessorProps) {
  const { anoLetivo, setAnoLetivo, anosDisponiveis, isLoadingAnos } =
    useAnoLetivo();

  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-medium">{titulo}</h1>
        {descricao && <p className="text-sm text-gray-700 mt-2">{descricao}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Ano Letivo:</span>
        {isLoadingAnos ? (
          <Skeleton className="h-10 w-[120px]" />
        ) : anosDisponiveis.length > 0 ? (
          <Select
            value={anoLetivo ? String(anoLetivo) : ""}
            onValueChange={(val) => setAnoLetivo(Number(val))}
          >
            <SelectTrigger className="w-[120px] bg-white border-zinc-200">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map((ano) => (
                <SelectItem key={ano} value={String(ano)}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-gray-500 bg-gray-100 border border-zinc-200 px-3 py-2 rounded-md">
            Sem turmas
          </span>
        )}
      </div>
    </section>
  );
}
