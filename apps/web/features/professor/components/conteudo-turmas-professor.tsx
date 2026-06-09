"use client";

import React from "react";
import { Users } from "lucide-react";
import { useTurmasProfessor } from "@/features/professor/hooks/use-professor";
import { useAnoLetivo } from "@/features/professor/contexts/ano-letivo-context";
import { CabecalhoProfessor } from "@/features/professor/components/cabecalho-professor";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CardTurma } from "./card-turma";

export function ConteudoTurmasProfessor() {
  const { anoLetivo, isLoadingAnos } = useAnoLetivo();
  const { data: resTurmas, isLoading: loadTurmas } = useTurmasProfessor(
    anoLetivo || undefined,
  );
  const turmas = resTurmas?.dados || [];
  const isLoading = loadTurmas || isLoadingAnos;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Users className="text-zinc-500" />
          Minhas Turmas
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full animate-in fade-in duration-300">
      <CabecalhoProfessor titulo="Minhas Turmas" />

      {turmas.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-zinc-300 bg-white/50 shadow-none max-w-2xl">
          <CardContent className="p-10 text-center text-zinc-500 text-lg">
            Nenhuma turma vinculada ao seu perfil no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {turmas.map((vinculo) => (
            <CardTurma key={vinculo.id} vinculo={vinculo} />
          ))}
        </div>
      )}
    </div>
  );
}
