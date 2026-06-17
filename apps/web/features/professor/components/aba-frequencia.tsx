"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Aula, Matricula } from "@repo/types";
import { SheetRegistrarFrequencia } from "@/features/professor/components/sheets/sheet-registrar-frequencia";
import { useMounted } from "@/hooks/use-mounted";

interface AbaFrequenciaProps {
  turmaId: number;
  disciplinaId: number;
  aulas: Aula[];
  alunos: Matricula[];
}

const getLocalDateString = (dataStr: string | Date) => {
  if (typeof dataStr === "string") {
    if (dataStr.includes("T")) return dataStr.split("T")[0];
    return dataStr;
  }

  const y = dataStr.getUTCFullYear();
  const m = String(dataStr.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dataStr.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function AbaFrequencia({
  turmaId,
  disciplinaId,
  aulas,
  alunos,
}: AbaFrequenciaProps) {
  const isMounted = useMounted();

  const { handleEditarChamada, SheetFrequencia } = SheetRegistrarFrequencia({
    turmaId,
    disciplinaId,
    alunos,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
          <NotepadText size={24} className="text-zinc-500" />
          Histórico de Aulas
        </h2>

        {SheetFrequencia}
      </div>

      <Card className="rounded-3xl border-zinc-100 shadow-sm max-w-[1200px] w-full mx-auto">
        <CardContent className="p-0">
          {aulas.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-500">
              Nenhuma aula registrada ainda.
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {aulas.map((aula) => (
                <div
                  key={aula.id}
                  className="flex items-center justify-between p-5 hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">
                        {format(
                          new Date(
                            `${getLocalDateString(aula.data_aula)}T00:00:00`,
                          ),
                          "dd 'de' MMMM, yyyy",
                          { locale: ptBR },
                        )}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {aula.quantidade} aula(s) ministrada(s)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarChamada(aula)}
                  >
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
