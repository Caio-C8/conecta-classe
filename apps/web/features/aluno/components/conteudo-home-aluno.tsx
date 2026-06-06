"use client";

import { FaCalendar, FaCheckCircle, FaClock } from "react-icons/fa";
import { useFrequenciaAluno } from "@/features/frequencia/hooks/use-frequencia-aluno";
import { useEventosAluno } from "@/features/evento/hooks/use-eventos-aluno";
import { useRendimentosAluno } from "@/features/rendimento/hooks/use-rendimentos-aluno";
import { useAnoLetivo } from "@/features/aluno/contexts/ano-letivo-context";
import { CabecalhoAluno } from "@/features/aluno/components/cabecalho-aluno";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatarData, formatarDiaMes } from "@repo/utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function ConteudoHomeAlunoPage() {
  const [nomeUsuario, setNomeUsuario] = useState<string>("Carregando...");
  const { anoLetivo, isLoadingAnos } = useAnoLetivo();

  const { data: resFrequencia, isLoading: loadFreq } = useFrequenciaAluno(
    anoLetivo || 0,
    !!anoLetivo,
  );
  const { data: resEventos, isLoading: loadEventos } = useEventosAluno(
    anoLetivo || 0,
    !!anoLetivo,
  );
  const { data: resRendimentos, isLoading: loadRendimento } =
    useRendimentosAluno(anoLetivo || 0, !!anoLetivo);

  const isLoading = loadFreq || loadEventos || loadRendimento || isLoadingAnos;

  const frequencia = resFrequencia?.dados;
  const eventos = resEventos?.dados || [];
  const rendimentos = resRendimentos?.dados;

  const hoje = new Date();
  const eventosFuturos = eventos
    .filter((e) => new Date(e.data_evento) >= hoje)
    .sort(
      (a, b) =>
        new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime(),
    );

  const proximoEvento = eventosFuturos[0];
  const agenda = eventosFuturos.slice(0, 3);

  const avaliacoes = (rendimentos?.rendimentos || [])
    .flatMap((r) =>
      (r.eventos || []).map((e) => ({
        ...e,
        disciplinaNome: r.disciplina.nome || "Disciplina Oculta",
      })),
    )
    .filter((e) => e.nota_obtida !== null)
    .sort((a, b) => {
      const dataA = a.data_evento ? new Date(a.data_evento).getTime() : 0;
      const dataB = b.data_evento ? new Date(b.data_evento).getTime() : 0;
      return dataB - dataA;
    })
    .slice(0, 3);

  useEffect(() => {
    const nomeSalvo = Cookies.get("nome");
    setNomeUsuario(nomeSalvo || "Aluno");
  }, []);

  return (
    <>
      <CabecalhoAluno titulo={`Olá, ${nomeUsuario}!`} />

      {isLoading ? (
        <div className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Skeleton className="h-32 rounded-2xl bg-white/50" />
            <Skeleton className="h-32 rounded-2xl bg-white/50" />
            <Skeleton className="h-32 rounded-2xl bg-white/50" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-10">
            <Skeleton className="h-[400px] rounded-2xl bg-white/50" />
            <Skeleton className="h-[400px] rounded-2xl bg-white/50" />
          </div>
        </div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="relative rounded-2xl shadow-sm border-zinc-100 bg-white">
              <CardContent className="p-5">
                <h4 className="text-sm text-gray-500">Média Geral</h4>

                <div className="mt-2 text-3xl font-semibold">
                  {rendimentos?.media_geral !== undefined
                    ? rendimentos.media_geral.toFixed(1)
                    : "--"}
                </div>

                <small className="mt-1 block text-sm text-green-600 select-none">
                  {`Um total de ${eventos.filter((e) => e.nota_evento !== null).length} avaliações.`}
                </small>

                <div className="absolute top-5 right-5 text-green-600 text-lg">
                  <FaCheckCircle />
                </div>
              </CardContent>
            </Card>

            <Card className="relative rounded-2xl shadow-sm border-zinc-100 bg-white">
              <CardContent className="p-5">
                <h4 className="text-sm text-gray-500">Frequência Geral</h4>

                <div className="mt-2 text-3xl font-semibold">
                  {frequencia?.visao === "POR_DISCIPLINA"
                    ? `${frequencia.porcentagem_frequencia_geral}%`
                    : frequencia?.visao === "GERAL"
                      ? `${frequencia.frequencia?.presenca_percentual}%`
                      : "-%"}
                </div>

                {frequencia?.visao === "POR_DISCIPLINA" ? (
                  <small className="mt-1 block text-sm text-yellow-500">
                    {`${frequencia?.total_faltas} faltas no total`}
                  </small>
                ) : frequencia?.visao === "GERAL" ? (
                  <small className="mt-1 block text-sm text-yellow-500">
                    {`${frequencia?.frequencia?.total_faltas} faltas no total`}
                  </small>
                ) : (
                  <></>
                )}

                <div className="absolute top-5 right-5 text-yellow-500 text-lg">
                  <FaClock />
                </div>
              </CardContent>
            </Card>

            <Card className="relative rounded-2xl shadow-sm border-zinc-100 bg-white">
              <CardContent className="p-5">
                <h4 className="text-sm text-gray-500">Próximo Evento</h4>

                <div
                  className="mt-2 text-xl md:text-2xl font-semibold line-clamp-1"
                  title={proximoEvento?.titulo}
                >
                  {proximoEvento
                    ? proximoEvento.titulo
                    : "Nenhum evento futuro"}
                </div>

                {proximoEvento && (
                  <small className="mt-1 block text-sm text-red-500">
                    {`No dia ${formatarData(proximoEvento.data_evento)}`}
                  </small>
                )}

                <div className="absolute top-5 right-5 text-red-500 text-lg">
                  <FaCalendar />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="order-2 lg:order-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold">
                  Últimas Notas
                </h3>
                <Link
                  href="/aluno/notas"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver todas as notas
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {avaliacoes.length === 0 ? (
                  <Card className="border-dashed shadow-none bg-white/50 rounded-xl">
                    <CardContent className="p-4 text-center text-sm text-zinc-500">
                      Nenhuma nota foi lançada para este ano.
                    </CardContent>
                  </Card>
                ) : (
                  avaliacoes.map((aval, i) => {
                    const aprovado =
                      (aval.nota_obtida || 0) >=
                      (aval.valor_nota ? aval.valor_nota * 0.6 : 6);
                    return (
                      <Card
                        key={i}
                        className={`rounded-2xl border-l-[5px] shadow-sm border-t border-b border-r border-zinc-100 bg-white
                          ${aprovado ? "border-l-green-600" : "border-l-red-500"}
                        `}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <strong className="block text-sm md:text-base">
                              {aval.titulo}
                            </strong>
                            <small className="text-gray-500 text-xs md:text-sm">
                              {aval.disciplinaNome} •{" "}
                              {aval.data_evento
                                ? formatarData(aval.data_evento)
                                : "Sem data"}
                            </small>
                          </div>
                          <div
                            className={`font-semibold text-sm md:text-base ${aprovado ? "text-green-600" : "text-red-500"}`}
                          >
                            {aval.nota_obtida} / {aval.valor_nota}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold">Agenda</h3>
                <Link
                  href="/aluno/calendario"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver calendário
                </Link>
              </div>

              <Card className="rounded-2xl shadow-sm border-zinc-100 bg-white">
                <CardContent className="p-5">
                  {agenda.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-center py-4">
                      Sua agenda de eventos está vazia.
                    </div>
                  ) : (
                    agenda.map((item, i) => {
                      const { dia, mes } = formatarDiaMes(item.data_evento);
                      return (
                        <div
                          key={i}
                          className="mb-4 last:mb-0 flex items-center gap-4"
                        >
                          <div className="w-10 text-center text-sm text-gray-500 flex-shrink-0">
                            <strong>{mes}</strong>
                            <br />
                            {dia}
                          </div>
                          <div
                            className="flex-1 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-xs md:text-sm text-blue-900 truncate"
                            title={item.titulo}
                          >
                            {item.titulo}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}
    </>
  );
}
