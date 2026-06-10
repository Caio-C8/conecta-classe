"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, LayoutDashboard, Info } from "lucide-react";
import { useRendimentosAluno } from "@/features/rendimento/hooks/use-rendimentos-aluno";
import { useAnoLetivo } from "@/features/aluno/contexts/ano-letivo-context";
import { CabecalhoAluno } from "@/features/aluno/components/cabecalho-aluno";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { NivelEnsino } from "@repo/types";
import { formatarData } from "@repo/utils";

const getColorByPercentage = (percentage: number) => {
  if (percentage >= 60) return "#10B981";
  if (percentage >= 40) return "#F59E0B";
  return "#EF4444";
};

export function ConteudoNotasAluno() {
  const { anoLetivo, isLoadingAnos } = useAnoLetivo();
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: resRendimentos, isLoading: loadRendimento } =
    useRendimentosAluno(anoLetivo || 0, !!anoLetivo);

  const isLoading = loadRendimento || isLoadingAnos;
  const dados = resRendimentos?.dados;
  const rendimentos = dados?.rendimentos || [];

  const formatarNivel = (nivel?: string | null) => {
    if (nivel === NivelEnsino.MEDIO) return "Ensino Médio";
    if (nivel === NivelEnsino.FUNDAMENTAL_2) return "Ensino Fundamental II";
    if (nivel === NivelEnsino.FUNDAMENTAL_1) return "Ensino Fundamental I";
    return nivel || "";
  };

  const stringTurma = dados?.turma
    ? `Acompanhe suas notas do ${dados.turma.serie}º ano - ${formatarNivel(dados.turma.nivel_ensino)}.`
    : "Acompanhe suas notas bimestrais e avaliações.";

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="space-y-4 mt-10 max-w-4xl mx-auto">
          <Skeleton className="h-[104px] w-full rounded-[32px] bg-white" />
          <Skeleton className="h-[104px] w-full rounded-[32px] bg-white" />
          <Skeleton className="h-[104px] w-full rounded-[32px] bg-white" />
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="pb-12">
        <CabecalhoAluno titulo="Notas" descricao={stringTurma} />
        <div className="mt-10 max-w-4xl mx-auto bg-white/50 border border-dashed border-gray-300 rounded-[32px] p-12 text-center text-gray-500">
          Nenhum registro de notas foi encontrado para o ano letivo selecionado.
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <CabecalhoAluno titulo="Notas" descricao={stringTurma} />

      <main className="mt-10 max-w-4xl mx-auto">
        <div className="mb-6 flex items-start gap-3 bg-blue-50/50 text-blue-700 p-4 rounded-2xl border border-blue-100">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            Para ser aprovado, você precisa alcançar uma nota igual ou superior
            a <span className="font-bold">60 pontos</span> em cada disciplina.
          </p>
        </div>

        {rendimentos.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-[32px] p-12 text-center text-gray-500">
            Nenhum registro de notas foi encontrado para o ano letivo
            selecionado.
          </div>
        ) : (
          <div className="space-y-4">
            {rendimentos.map((rend) => {
              const isExpanded = expanded === rend.id;
              const totalDistribuido = rend.eventos.reduce(
                (acc, ev) => acc + (ev.valor_nota ?? 0),
                0,
              );
              let percentage = 0;
              if (totalDistribuido === 0) {
                percentage = 100;
              } else {
                percentage = (rend.nota_total / totalDistribuido) * 100;
              }
              const cor = getColorByPercentage(percentage);

              return (
                <Card
                  key={rend.id}
                  className="rounded-[32px] p-0 border-zinc-100 shadow-sm overflow-hidden bg-white transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : rend.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 md:space-x-5 text-left">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${cor}15`,
                          color: cor,
                        }}
                      >
                        <LayoutDashboard size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">
                          {rend.disciplina.nome || "Disciplina Oculta"}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-6">
                      <span>
                        <span
                          className="md:inline text-xl font-black"
                          style={{ color: cor }}
                        >
                          {rend.nota_total.toFixed(1) ?? 0}
                        </span>{" "}
                        /
                        {rend.eventos.reduce(
                          (acc, ev) => acc + (ev.valor_nota ?? 0),
                          0,
                        )}
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 md:px-7 pb-8 pt-2 border-t border-gray-50 bg-white">
                      <div className="space-y-3 mt-2">
                        {rend.eventos.length === 0 ? (
                          <div className="text-sm text-zinc-500 text-center py-4 bg-gray-50/50 rounded-2xl">
                            Nenhuma avaliação foi lançada nesta disciplina.
                          </div>
                        ) : (
                          rend.eventos.map(
                            (ev) =>
                              ev.valor_nota !== null && (
                                <div
                                  key={ev.id}
                                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 border border-gray-100/50"
                                >
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">
                                      {ev.titulo}
                                    </p>
                                    <p className="text-[11px] font-medium text-gray-500 mt-1 uppercase tracking-wider">
                                      Data: {formatarData(ev.data_evento ?? "")}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0 ml-4">
                                    <span className="text-lg font-black text-gray-800">
                                      {ev.nota_obtida !== null
                                        ? ev.nota_obtida
                                        : "-"}
                                    </span>
                                    <span className="text-sm font-bold text-gray-400 ml-1">
                                      /{" "}
                                      {ev.valor_nota !== null
                                        ? ev.valor_nota
                                        : "-"}
                                    </span>
                                  </div>
                                </div>
                              ),
                          )
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
