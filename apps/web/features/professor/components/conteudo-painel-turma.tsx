"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import {
  useTurmasProfessor,
  useAulasProfessor,
  useEventosPorTurmaEDisciplina,
  useMatriculasCursando,
} from "@/features/professor/hooks/use-professor";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NivelEnsino, SituacaoTurma } from "@repo/types";
import { AbaFrequencia } from "./aba-frequencia";
import { AbaAvaliacoes } from "./aba-avaliacoes";
import { AbaAlunos } from "./aba-alunos";

export function ConteudoPainelTurma() {
  const params = useParams();
  const searchParams = useSearchParams();

  const turmaId = Number(params.id);
  const disciplinaId = Number(searchParams.get("disciplina"));

  const { data: resTurmas, isLoading: loadTurmas } = useTurmasProfessor();
  const { data: resAulas, isLoading: loadAulas } = useAulasProfessor(
    turmaId,
    disciplinaId,
  );
  const { data: resEventos, isLoading: loadEventos } =
    useEventosPorTurmaEDisciplina(turmaId, disciplinaId);
  const { data: resMatriculas } = useMatriculasCursando(turmaId, {
    disciplinaId,
  });

  const [abaAtiva, setAbaAtiva] = useState<string>("frequencia");

  const isLoading = loadTurmas || loadAulas || loadEventos;

  const vinculoAtual = resTurmas?.dados?.find(
    (v) => v.turma_id === turmaId && v.disciplina_id === disciplinaId,
  );

  const alunos = resMatriculas?.dados || [];
  const aulas = resAulas?.dados || [];
  const eventos = resEventos?.dados || [];

  if (isLoading) {
    return (
      <div className="pb-12 mx-auto w-full space-y-8">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!vinculoAtual) {
    return (
      <div className="text-center py-20 text-zinc-500">
        Turma não encontrada ou você não possui acesso.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      {/* Cabeçalho da turma */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="flex gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hidden md:flex">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-zinc-900">
                {vinculoAtual.turma.serie}º Ano{" - "}
                {vinculoAtual.turma.identificacao}
                {" - "}
                {vinculoAtual.turma.nivel_ensino ===
                  NivelEnsino.FUNDAMENTAL_1 && "Fundamental I"}
                {vinculoAtual.turma.nivel_ensino ===
                  NivelEnsino.FUNDAMENTAL_2 && "Fundamental II"}
                {vinculoAtual.turma.nivel_ensino === NivelEnsino.MEDIO &&
                  "Ensino Médio"}
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                {vinculoAtual.disciplina.nome} •{" "}
                {vinculoAtual.quantidade_matriculas} alunos
              </p>
            </div>
          </div>

          <Badge
            variant={
              vinculoAtual.turma.situacao === SituacaoTurma.EM_ANDAMENTO
                ? "secondary"
                : vinculoAtual.turma.situacao === SituacaoTurma.ENCERRADA
                  ? "destructive"
                  : "default"
            }
          >
            {vinculoAtual.turma.situacao === SituacaoTurma.EM_ANDAMENTO
              ? "Em Andamento"
              : vinculoAtual.turma.situacao === SituacaoTurma.ENCERRADA
                ? "Encerrada"
                : "Não Iniciada"}
          </Badge>
        </div>
      </div>

      {/* Tabs de navegação */}
      <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
        <TabsList className="mb-8 flex justify-start gap-2 border-none bg-transparent p-0 overflow-x-auto max-w-full flex-nowrap pb-2 hide-scrollbar">
          <TabsTrigger
            value="frequencia"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-500 transition-all data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:hover:text-primary-foreground"
          >
            Diário de Frequência
          </TabsTrigger>
          <TabsTrigger
            value="avaliacoes"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-500 transition-all data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:hover:text-primary-foreground"
          >
            Avaliações e Notas
          </TabsTrigger>
          <TabsTrigger
            value="alunos"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-500 transition-all data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:hover:text-primary-foreground"
          >
            Alunos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Conteúdo da aba ativa */}
      <div>
        {abaAtiva === "frequencia" && (
          <AbaFrequencia
            turmaId={turmaId}
            disciplinaId={disciplinaId}
            aulas={aulas}
            alunos={alunos}
          />
        )}

        {abaAtiva === "avaliacoes" && (
          <AbaAvaliacoes
            turmaId={turmaId}
            disciplinaId={disciplinaId}
            eventos={eventos}
          />
        )}

        {abaAtiva === "alunos" && (
          <AbaAlunos alunos={alunos} disciplinaId={disciplinaId} />
        )}
      </div>
    </div>
  );
}
