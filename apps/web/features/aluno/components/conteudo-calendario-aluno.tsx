"use client";

import { useState } from "react";
import { useEventosAluno } from "@/features/evento/hooks/use-eventos-aluno";
import { useAnoLetivo } from "@/features/aluno/contexts/ano-letivo-context";
import { CabecalhoAluno } from "@/features/aluno/components/cabecalho-aluno";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { formatarDiaMes } from "@repo/utils";
import { CalendarDays } from "lucide-react";

const isSameDay = (date1: Date | undefined, dateStr2: string | Date) => {
  if (!date1) return false;
  const d2 = new Date(dateStr2);

  return (
    date1.getDate() === d2.getUTCDate() &&
    date1.getMonth() === d2.getUTCMonth() &&
    date1.getFullYear() === d2.getUTCFullYear()
  );
};

const formatarDataLocal = (date: Date) => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function ConteudoCalendarioAluno() {
  const { anoLetivo, isLoadingAnos } = useAnoLetivo();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const { data: resEventos, isLoading: loadEventos } = useEventosAluno(
    anoLetivo || 0,
    !!anoLetivo,
  );

  const isLoading = loadEventos || isLoadingAnos;
  const eventos = resEventos?.dados || [];

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 mt-10">
          <Skeleton className="h-[350px] w-full md:w-[350px] rounded-[32px] bg-white" />
          <Skeleton className="h-[350px] w-full rounded-[32px] bg-white" />
        </div>
      </div>
    );
  }

  const eventosDoDiaSelecionado = eventos.filter((ev) =>
    isSameDay(selectedDate, ev.data_evento),
  );

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const agendaCompleta = eventos
    .filter((e) => new Date(e.data_evento) >= hoje)
    .sort(
      (a, b) =>
        new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime(),
    );

  const datasComEventos = eventos.map((ev) => {
    const d = new Date(ev.data_evento);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  });

  return (
    <div className="flex flex-col gap-10">
      <CabecalhoAluno
        titulo="Calendário Acadêmico"
        descricao="Acompanhe seus eventos, avaliações e prazos."
      />

      <main className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
          <div className="flex justify-center lg:justify-start">
            <Card className="rounded-[32px] shadow-sm border-gray-100 bg-white inline-block p-0">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl w-[280px]"
                  captionLayout="dropdown"
                  modifiers={{
                    hasEvent: datasComEventos,
                  }}
                  modifiersClassNames={{
                    hasEvent:
                      "font-bold text-blue-600 bg-blue-50/50 relative after:content-[''] after:w-1 after:h-1 after:bg-blue-600 after:rounded-full after:absolute after:bottom-1",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Eventos do dia{" "}
              {selectedDate ? formatarDataLocal(selectedDate) : "--"}
            </h2>

            <div className="space-y-4">
              {eventosDoDiaSelecionado.length === 0 ? (
                <div className="bg-white/50 border border-dashed border-gray-300 rounded-[32px] p-10 text-center">
                  <p className="text-sm font-medium text-gray-400">
                    Nenhum evento programado para este dia.
                  </p>
                </div>
              ) : (
                eventosDoDiaSelecionado.map((ev) => {
                  return (
                    <Card
                      key={ev.id}
                      className="rounded-[32px] shadow-sm border-gray-100 bg-white p-0"
                    >
                      <CardContent className="p-6 flex items-start space-x-4">
                        <div
                          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: "#3B82F6" }}
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight md:text-lg">
                            {ev.titulo}
                          </h4>
                          <p className="text-xs font-bold text-gray-400 uppercase mt-2 tracking-widest flex items-center gap-2">
                            <CalendarDays size={14} />
                            {ev.disciplina?.nome || "Evento Geral"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
            Agenda Completa
          </h2>

          <Card className="rounded-[32px] shadow-sm border-gray-100 bg-white p-0">
            <CardContent className="p-4 md:p-4">
              {agendaCompleta.length === 0 ? (
                <div className="text-sm text-zinc-500 text-center py-6">
                  Não há eventos futuros registrados.
                </div>
              ) : (
                <div>
                  {agendaCompleta.map((item, i) => {
                    const { dia, mes } = formatarDiaMes(
                      new Date(item.data_evento),
                    );

                    return (
                      <div
                        key={item.id || i}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-sm flex-shrink-0">
                          <strong className="text-gray-900">{dia}</strong>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {mes}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">
                            {item.titulo}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {item.disciplina?.nome || "Evento Geral"}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <span className="inline-block rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-900">
                            {item.tipo_evento}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
