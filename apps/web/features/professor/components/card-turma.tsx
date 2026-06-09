import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfessorTurmaDetalhado } from "@repo/types";

interface CardTurmaProps {
  vinculo: ProfessorTurmaDetalhado;
}

export function CardTurma({ vinculo }: CardTurmaProps) {
  return (
    <Link
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
  );
}
