"use client";

import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { useTurmasProfessor } from "@/features/professor/hooks/use-professor";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TurmasProfessorPage() {
  const { data: resTurmas, isLoading } = useTurmasProfessor();
  const turmas = resTurmas?.dados || [];

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
      <h1 className="mb-8 text-2xl md:text-3xl font-medium">Minhas Turmas</h1>

      {turmas.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-zinc-300 bg-white/50 shadow-none max-w-2xl">
          <CardContent className="p-10 text-center text-zinc-500 text-lg">
            Nenhuma turma vinculada ao seu perfil no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {turmas.map((vinculo) => (
            <Link
              key={vinculo.id}
              href={`/professor/turmas/${vinculo.turma_id}?disciplina=${vinculo.disciplina_id}`}
              className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
            >
              <Card className="flex h-full flex-col rounded-2xl border-zinc-100 shadow-sm p-0 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xl font-semibold text-blue-600 transition-colors">
                    {vinculo.turma.serie}º Ano {vinculo.turma.identificacao}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-gray-500 font-medium text-base mt-1">
                    {vinculo.disciplina.nome}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-6 pt-2 pb-6">
                  <p className="text-sm text-gray-700 bg-zinc-50 px-3 py-1.5 rounded-lg inline-block border border-zinc-100">
                    {vinculo.quantidade_matriculas} alunos matriculados
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
