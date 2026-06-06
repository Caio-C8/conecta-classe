"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useTurmasProfessor,
  useProximosEventosProfessor,
} from "@/features/professor/hooks/use-professor";

// Função utilitária para formatar a data como "Amanhã", "Em 3 dias", etc.
const formatarDataRelativa = (dataStr: string | Date) => {
  const dataEvento = new Date(dataStr);
  const hoje = new Date();

  // Zera as horas para comparar apenas os dias
  dataEvento.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const diffTempo = dataEvento.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Amanhã";
  return `Em ${diffDias} dias`;
};

export function ConteudoHomeProfessor() {
  const [nomeProfessor, setNomeProfessor] = useState("Professor(a)");

  const { data: resTurmas, isLoading: loadTurmas } = useTurmasProfessor();
  const { data: resEventos, isLoading: loadEventos } =
    useProximosEventosProfessor();

  const turmas = resTurmas?.dados || [];
  const proximosEventos = resEventos?.dados || [];
  const isLoading = loadTurmas || loadEventos;

  useEffect(() => {
    const nomeCookie = Cookies.get("nome");
    if (nomeCookie) {
      // Pega apenas o primeiro nome para ficar mais amigável
      setNomeProfessor(nomeCookie.split(" ")[0]);
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <Skeleton className="mb-8 h-10 w-64" />
        <main className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
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
      <h1 className="mb-8 text-2xl md:text-3xl font-medium text-zinc-900">
        Olá, {nomeProfessor}!
      </h1>

      <main className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {/* ESQUERDA: TURMAS */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-zinc-800">
            Minhas Turmas:
          </h2>

          {turmas.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-zinc-300 bg-white/50 shadow-none">
              <CardContent className="p-8 text-center text-zinc-500">
                Nenhuma turma vinculada ao seu perfil no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {turmas.map((turma) => (
                <Card
                  key={turma.idTurma}
                  className="flex flex-col rounded-2xl border-zinc-100 shadow-sm p-0"
                >
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg font-semibold text-blue-600">
                      {turma.nomeTurma}
                    </CardTitle>
                    <CardDescription className="line-clamp-1 text-gray-500">
                      {turma.materia}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 p-5 pt-0 pb-4">
                    <p className="text-sm text-gray-700">
                      {turma.numeroAlunos} alunos matriculados
                    </p>
                  </CardContent>

                  <CardFooter className="mt-auto flex gap-3 p-5 pt-0">
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition"
                    >
                      <Link
                        href={`/professor/frequencia?turmaId=${turma.idTurma}`}
                      >
                        Chamada
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition"
                    >
                      <Link
                        href={`/professor/eventos?turmaId=${turma.idTurma}`}
                      >
                        Eventos
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* DIREITA: AVISOS E EVENTOS */}
        <aside className="flex flex-col gap-5">
          {/* NOTAS PENDENTES (Placeholder estrutural) */}
          <Card className="rounded-2xl border-zinc-100 shadow-sm p-0">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-4">
              <CardTitle className="text-base font-bold text-zinc-800">
                Notas Pendentes:
              </CardTitle>
              <Badge
                variant="secondary"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-500 hover:bg-zinc-200"
              >
                0
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="rounded-xl border border-dashed border-zinc-200 bg-slate-50 p-4 text-center text-sm text-zinc-500">
                Tudo em dia! Nenhuma nota pendente de lançamento.
              </div>
            </CardContent>
          </Card>

          {/* PRÓXIMAS ATIVIDADES */}
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

                      <Button
                        asChild
                        variant="link"
                        className="flex-shrink-0 px-2 text-sm font-medium text-blue-600"
                      >
                        <Link href={`/professor/eventos`}>Ver</Link>
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
