"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useTurmasProfessor,
  useProximosEventos,
  useEventosPendentes,
} from "@/features/professor/hooks/use-professor";

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

const formatarDataRelativa = (dataStr: string | Date) => {
  const dataEvento = getLocalDateString(dataStr)!;
  const hojeLocal = getLocalDateString(new Date())!;

  const dataObj = new Date(`${dataEvento}T00:00:00`);
  const hojeObj = new Date(`${hojeLocal}T00:00:00`);

  const diffTempo = dataObj.getTime() - hojeObj.getTime();
  const diffDias = Math.round(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Amanhã";
  if (diffDias === -1) return "Ontem";
  if (diffDias > 1) return `Em ${diffDias} dias`;
  return `Ocorreu há ${Math.abs(diffDias)} dias`;
};

export function ConteudoHomeProfessor() {
  const [nomeProfessor, setNomeProfessor] = useState("Professor(a)");

  const { data: resTurmas, isLoading: loadTurmas } = useTurmasProfessor();
  const { data: resEventos, isLoading: loadEventos } = useProximosEventos();
  const { data: resPendentes, isLoading: loadPendentes } =
    useEventosPendentes();

  const turmas = resTurmas?.dados || [];
  const proximosEventos = resEventos?.dados || [];
  const eventosPendentes = resPendentes?.dados || [];

  const isLoading = loadTurmas || loadEventos || loadPendentes;

  useEffect(() => {
    const nomeCookie = Cookies.get("nome");
    if (nomeCookie) {
      setNomeProfessor(nomeCookie.split(" ")[0]);
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <Skeleton className="mb-8 h-10 w-64" />
        <main className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
          <aside className="flex flex-col gap-5">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </aside>
        </main>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-2xl md:text-3xl font-medium">
        Olá, {nomeProfessor}!
      </h1>

      <main className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-medium">Minhas Turmas</h2>
            <Button variant="link" className="link">
              <Link href="/professor/turmas">Ver todas</Link>
            </Button>
          </div>

          {turmas.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-zinc-300 bg-white/50 shadow-none">
              <CardContent className="p-8 text-center text-zinc-500">
                Nenhuma turma vinculada ao seu perfil no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {turmas.map(
                (vinculo, index) =>
                  index < 4 && (
                    <Link
                      key={vinculo.id}
                      href={`/professor/turmas/${vinculo.turma_id}?disciplina=${vinculo.disciplina_id}`}
                      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                    >
                      <Card className="flex h-full flex-col rounded-2xl border-zinc-100 shadow-sm p-0 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
                        <CardHeader className="p-6 pb-2">
                          <CardTitle className="text-xl font-semibold text-blue-600 transition-colors">
                            {vinculo.turma.serie}º Ano{" "}
                            {vinculo.turma.identificacao}
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
                  ),
              )}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-5">
          <Card className="rounded-2xl border-zinc-100 shadow-sm p-0">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-4">
              <CardTitle className="text-base font-bold text-zinc-800">
                Notas Pendentes:
              </CardTitle>
              <Badge
                variant={
                  eventosPendentes.length > 0 ? "destructive" : "secondary"
                }
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  eventosPendentes.length === 0
                    ? "bg-zinc-200 text-zinc-500 hover:bg-zinc-200"
                    : ""
                }`}
              >
                {eventosPendentes.length}
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {eventosPendentes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-slate-50 p-4 text-center text-sm text-zinc-500">
                  Tudo em dia! Nenhuma nota pendente de lançamento.
                </div>
              ) : (
                <div className="space-y-3">
                  {eventosPendentes.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-xl border-l-4 border-red-500 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                    >
                      <div className="pr-4">
                        <h4
                          className="line-clamp-1 text-sm font-medium text-zinc-900"
                          title={ev.titulo}
                        >
                          {ev.titulo}
                        </h4>
                        <small className="mt-0.5 block text-gray-500">
                          {ev.turma?.serie}º Ano {ev.turma?.identificacao} •{" "}
                          {formatarDataRelativa(ev.data_evento)}
                        </small>
                      </div>

                      <Button asChild variant="link" className="link">
                        <Link
                          href={`/professor/turmas/${ev.turma_id}?disciplina=${ev.disciplina_id}`}
                        >
                          Lançar
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-100 shadow-sm p-0">
            <CardHeader className="p-5 pb-4">
              <CardTitle className="text-base font-bold text-zinc-800">
                Próximas Atividades
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {proximosEventos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-slate-50 p-4 text-center text-sm text-zinc-500">
                  Nenhum evento programado.
                </div>
              ) : (
                <div className="space-y-3">
                  {proximosEventos.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-xl border-l-4 border-yellow-500 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                    >
                      <div className="pr-4">
                        <h4
                          className="line-clamp-1 text-sm font-medium text-zinc-900"
                          title={ev.titulo}
                        >
                          {ev.titulo}
                        </h4>
                        <small className="mt-0.5 block text-gray-500">
                          {ev.turma?.serie}º Ano {ev.turma?.identificacao} •{" "}
                          {formatarDataRelativa(ev.data_evento)}
                        </small>
                      </div>

                      <Button asChild variant="link" className="link">
                        <Link
                          href={`/professor/turmas/${ev.turma_id}?disciplina=${ev.disciplina_id}`}
                        >
                          Ver
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  );
}
