"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Matricula, SituacaoRendimento } from "@repo/types";

interface AbaAlunosProps {
  alunos: Matricula[];
  disciplinaId: number;
}

export function AbaAlunos({ alunos, disciplinaId }: AbaAlunosProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
          <Users size={24} className="text-zinc-500" />
          Alunos Matriculados
        </h2>
        <span className="text-sm font-normal text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
          {alunos.length} alunos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alunos.length === 0 ? (
          <p className="text-sm text-zinc-500 p-8 col-span-full text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            Nenhum aluno matriculado nesta turma.
          </p>
        ) : (
          alunos.map((matricula) => (
            <div
              key={matricula.id}
              className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                {matricula.aluno?.usuario?.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p
                    className="font-semibold text-zinc-900 line-clamp-1"
                    title={matricula.aluno?.usuario?.nome}
                  >
                    {matricula.aluno?.usuario?.nome}
                  </p>
                </div>

                {(() => {
                  const rendimento =
                    matricula.rendimentos_disciplinas?.find(
                      (r: any) => r.disciplina_id === disciplinaId,
                    ) || matricula.rendimentos_disciplinas?.[0];

                  if (!rendimento) return null;

                  return (
                    <Badge
                      variant={
                        rendimento.situacao === SituacaoRendimento.APROVADO
                          ? "success"
                          : rendimento.situacao === SituacaoRendimento.CURSANDO
                            ? "secondary"
                            : rendimento.situacao ===
                                  SituacaoRendimento.REPROVADO_POR_FALTA ||
                                rendimento.situacao ===
                                  SituacaoRendimento.REPROVADO_POR_NOTA ||
                                rendimento.situacao ===
                                  SituacaoRendimento.REPROVADO_POR_NOTA_E_FALTA
                              ? "destructive"
                              : "outline"
                      }
                      className="text-xs px-2 py-0.5 max-w-fit"
                    >
                      {rendimento.situacao === SituacaoRendimento.APROVADO
                        ? "Aprovado"
                        : rendimento.situacao === SituacaoRendimento.CURSANDO
                          ? "Cursando"
                          : rendimento.situacao ===
                              SituacaoRendimento.REPROVADO_POR_FALTA
                            ? "Reprovado por falta"
                            : rendimento.situacao ===
                                SituacaoRendimento.REPROVADO_POR_NOTA
                              ? "Reprovado por nota"
                              : rendimento.situacao ===
                                  SituacaoRendimento.REPROVADO_POR_NOTA_E_FALTA
                                ? "Reprovado por nota e falta"
                                : "Transferido"}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
