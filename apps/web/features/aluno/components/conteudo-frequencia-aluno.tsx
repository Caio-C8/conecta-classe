"use client";

import { useFrequenciaAluno } from "@/features/frequencia/hooks/use-frequencia-aluno";
import { useAnoLetivo } from "@/features/aluno/contexts/ano-letivo-context";
import { CabecalhoAluno } from "@/features/aluno/components/cabecalho-aluno";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { NivelEnsino } from "@repo/types";

const getColorByPercentage = (percentage: number) => {
  if (percentage >= 60) return "#10B981";
  if (percentage >= 40) return "#F59E0B";
  return "#EF4444";
};

export function ConteudoFrequenciaAluno() {
  const { anoLetivo, isLoadingAnos } = useAnoLetivo();

  const { data: resFrequencia, isLoading: loadFreq } = useFrequenciaAluno(
    anoLetivo || 0,
    !!anoLetivo,
  );

  const isLoading = loadFreq || isLoadingAnos;
  const dados = resFrequencia?.dados;

  const formatarNivel = (nivel?: string | null) => {
    if (nivel === NivelEnsino.MEDIO) return "Ensino Médio";
    if (nivel === NivelEnsino.FUNDAMENTAL_2) return "Ensino Fundamental II";
    if (nivel === NivelEnsino.FUNDAMENTAL_1) return "Ensino Fundamental I";
    return nivel || "";
  };

  const stringTurma = dados?.turma
    ? `Acompanhe suas frequências do ${dados.turma.serie}º ano - ${formatarNivel(dados.turma.nivel_ensino)}.`
    : "Acompanhe suas presenças e faltas do ano letivo selecionado.";

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 mt-10">
          <Skeleton className="h-40 rounded-[32px] bg-white" />
          <Skeleton className="h-40 rounded-[32px] bg-white" />
          <Skeleton className="h-40 rounded-[32px] bg-white" />
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <>
        <CabecalhoAluno titulo="Frequência" descricao={stringTurma} />
        <div className="mt-6 bg-white/50 border border-dashed border-gray-300 rounded-[32px] p-12 text-center text-gray-500">
          Nenhum registro de frequência foi encontrado para o ano letivo
          selecionado.
        </div>
      </>
    );
  }

  const isVisaoGeral = dados.visao === "GERAL";

  const totalAulasGeral = isVisaoGeral
    ? dados.frequencia?.total_aulas || 0
    : dados.total_aulas || 0;
  const totalFaltasGeral = isVisaoGeral
    ? dados.frequencia?.total_faltas || 0
    : dados.total_faltas || 0;
  const porcentagemGeral = isVisaoGeral
    ? dados.frequencia?.presenca_percentual || 0
    : dados.porcentagem_frequencia_geral || 0;

  const circleCircumference = 377;
  const circleOffset =
    circleCircumference - (porcentagemGeral / 100) * circleCircumference;
  const circleColor = getColorByPercentage(porcentagemGeral);

  return (
    <div className="flex flex-col gap-10">
      <CabecalhoAluno titulo="Frequência" descricao={stringTurma} />

      <main>
        {isVisaoGeral ? (
          <>
            <div className="mb-6 flex items-start gap-3 bg-blue-50/50 text-blue-700 p-4 rounded-2xl border border-blue-100 max-w-4xl mx-auto">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                Para ser aprovado, sua frequência geral deve ser igual ou
                superior a <span className="font-bold">75%</span>.
              </p>
            </div>
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-4xl mx-auto">
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 140 140"
                >
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    stroke="#f3f4f6"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    stroke={circleColor}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-4xl font-black"
                    style={{ color: circleColor }}
                  >
                    {porcentagemGeral}%
                  </span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                    de presença
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-8 w-full">
                <div className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center border border-gray-100">
                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Total de Aulas
                    </span>
                    <span className="text-3xl font-bold text-gray-800">
                      {totalAulasGeral}
                    </span>
                  </div>
                </div>

                <div className="bg-red-50 rounded-2xl p-6 flex justify-between items-center border border-red-100">
                  <div>
                    <span className="text-xs font-black text-red-400 uppercase tracking-widest block mb-1">
                      Total de Faltas
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                      {totalFaltasGeral}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 mx-auto max-w-4xl">
            <div className="mb-2 flex items-start gap-3 bg-blue-50/50 text-blue-700 p-4 rounded-2xl border border-blue-100">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                Para ser aprovado, sua frequência em cada disciplina deve ser
                igual ou superior a <span className="font-bold">75%</span>.
              </p>
            </div>
            {!dados.frequencias || dados.frequencias.length === 0 ? (
              <div className="bg-white/50 border border-dashed border-gray-300 rounded-[32px] p-8 text-center text-gray-500">
                Nenhuma frequência lançada nas disciplinas.
              </div>
            ) : (
              dados.frequencias.map((freq, i) => {
                const presencePercentage = Math.round(freq.presenca_percentual);
                const color = getColorByPercentage(presencePercentage);
                const isAbaixoLimite = presencePercentage < 75;

                return (
                  <div
                    key={freq.disciplina.id || i}
                    className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-50 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start space-x-5 lg:w-[35%]">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${color}15`,
                            color: color,
                          }}
                        >
                          <LayoutDashboard size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#1A202C]">
                            {freq.disciplina.nome}
                          </h3>
                          <p className="text-sm font-medium text-gray-400 mt-1">
                            {stringTurma}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 max-w-md w-full">
                        <div className="flex justify-between items-end mb-3">
                          <div className="flex space-x-6">
                            <div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">
                                Realizadas
                              </span>
                              <span className="text-lg font-bold text-gray-700">
                                {freq.aulas_realizadas}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">
                                Faltas
                              </span>
                              <span
                                className={`text-lg font-bold ${freq.faltas > 0 ? "text-red-500" : "text-green-500"}`}
                              >
                                {freq.faltas}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className="text-2xl font-black"
                              style={{ color: color }}
                            >
                              {presencePercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${presencePercentage}%`,
                              backgroundColor: color,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end lg:space-x-4 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0 lg:w-[20%]">
                        <div
                          className={`flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold ${
                            isAbaixoLimite
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {isAbaixoLimite ? (
                            <AlertCircle size={14} className="mr-2" />
                          ) : (
                            <CheckCircle2 size={14} className="mr-2" />
                          )}
                          {isAbaixoLimite
                            ? "Alerta de faltas"
                            : "Frequência regular"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
