"use client";

import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Evento } from "@repo/types";
import { SheetLancarNotas } from "@/features/professor/components/sheets/sheet-lancar-notas";
import { ModalEditarEvento } from "@/features/professor/components/modais/modal-editar-evento";
import { ModalCriarEvento } from "@/features/professor/components/modais/modal-criar-evento";

interface AbaAvaliacoesProps {
  turmaId: number;
  disciplinaId: number;
  eventos: Evento[];
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

const isPassado = (dataStr: string | Date) => {
  const dataEvento = getLocalDateString(dataStr)!;
  const hojeLocal = getLocalDateString(new Date())!;
  return dataEvento <= hojeLocal;
};

export function AbaAvaliacoes({
  turmaId,
  disciplinaId,
  eventos,
}: AbaAvaliacoesProps) {
  const eventosProximos = eventos.filter((e) => !isPassado(e.data_evento));
  const eventosConcluidos = eventos.filter((e) => isPassado(e.data_evento));

  const totalPontosGeral = eventos.reduce(
    (acc, ev) => acc + (Number(ev.valor_nota) || 0),
    0,
  );
  const totalPontosConcluidos = eventosConcluidos.reduce(
    (acc, ev) => acc + (Number(ev.valor_nota) || 0),
    0,
  );
  const totalPontosProximos = eventosProximos.reduce(
    (acc, ev) => acc + (Number(ev.valor_nota) || 0),
    0,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <CalendarDays className="text-zinc-500" />
            Eventos da Turma
          </h2>
          <span className="text-sm font-normal text-zinc-400 px-2 py-0.5">
            {totalPontosGeral}/100 pontos foram distribuídos
          </span>
        </div>
        <ModalCriarEvento
          turmaId={turmaId}
          disciplinaId={disciplinaId}
          estiloTrigger="button"
        />
      </div>

      {/* Eventos Concluídos */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <h3 className="text-base font-bold text-zinc-500 uppercase tracking-widest">
            Eventos Concluídos
          </h3>
          <span className="text-sm font-medium text-zinc-400 normal-case px-2 py-0.5">
            ({totalPontosConcluidos} pontos foram distribuídos)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventosConcluidos.length === 0 ? (
            <p className="text-sm text-zinc-500 p-4">
              Nenhum evento concluído.
            </p>
          ) : (
            eventosConcluidos.map((ev) => (
              <Card
                key={ev.id}
                className="rounded-2xl shadow-sm border-zinc-100 hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-zinc-900">
                      {ev.titulo}
                    </CardTitle>
                    <span className="text-sm text-zinc-500 font-medium">
                      Nota do evento: {ev.valor_nota || "--"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">
                    Ocorreu em:{" "}
                    {format(
                      new Date(
                        `${getLocalDateString(ev.data_evento)}T00:00:00`,
                      ),
                      "dd/MM/yyyy",
                    )}
                  </p>
                </CardHeader>
                <CardContent
                  className={`p-5 pt-0 flex gap-2 ${ev.valor_nota !== null ? "justify-between" : "justify-end"}`}
                >
                  {ev.valor_nota !== null && (
                    <SheetLancarNotas
                      eventoId={ev.id}
                      turmaId={turmaId}
                      tituloEvento={ev.titulo}
                      valorNota={Number(ev.valor_nota)}
                    >
                      <Button
                        variant="default"
                        className="bg-zinc-900 hover:bg-zinc-800"
                      >
                        Lançar / Editar Notas
                      </Button>
                    </SheetLancarNotas>
                  )}
                  <ModalEditarEvento evento={ev} estiloTrigger="button" />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <h3 className="text-base font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            Próximos Eventos
          </h3>
          <span className="text-sm font-medium text-zinc-400 normal-case px-2 py-0.5">
            ({totalPontosProximos} pontos foram distribuídos)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventosProximos.length === 0 ? (
            <p className="text-sm text-zinc-500 p-4">
              Nenhum evento futuro agendado.
            </p>
          ) : (
            eventosProximos.map((ev) => (
              <Card
                key={ev.id}
                className="rounded-2xl shadow-sm border-zinc-100"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex item-center justify-between">
                    <CardTitle className="text-lg text-zinc-900">
                      {ev.titulo}
                    </CardTitle>
                    <span className="text-sm text-zinc-500 font-medium">
                      Nota do evento: {ev.valor_nota || "--"}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 font-bold mt-1 flex items-center gap-1">
                    <Clock size={12} /> Agendado para:{" "}
                    {format(
                      new Date(
                        `${getLocalDateString(ev.data_evento)}T00:00:00`,
                      ),
                      "dd/MM",
                    )}
                  </p>
                </CardHeader>
                <CardContent className="p-5 pt-0 flex justify-end">
                  <ModalEditarEvento evento={ev} estiloTrigger="button" />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
