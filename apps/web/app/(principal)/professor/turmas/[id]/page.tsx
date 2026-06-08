"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Minus,
  NotepadText,
  Plus,
  Users,
} from "lucide-react";
import {
  useTurmasProfessor,
  useAulasProfessor,
  useEventosPorTurmaEDisciplina,
  useMatriculasCursando,
  useRegistrarFrequencia,
} from "@/features/professor/hooks/use-professor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaPlus } from "react-icons/fa";
import { SheetLancarNotas } from "@/features/professor/components/sheet-lancar-notas";
import { ModalEditarEvento } from "@/features/professor/components/modais/modal-editar-evento";
import { ModalCriarEvento } from "@/features/professor/components/modais/modal-criar-evento";

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

export default function PainelTurmaPage() {
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
  const { data: resMatriculas } = useMatriculasCursando(turmaId);

  const { mutate: registrarFrequencia, isPending: isSalvandoChamada } =
    useRegistrarFrequencia();

  const [abaAtiva, setAbaAtiva] = useState<string>("frequencia");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dataAula, setDataAula] = useState(getLocalDateString(new Date())!);
  const [quantidadeAulas, setQuantidadeAulas] = useState(1);
  const [faltas, setFaltas] = useState<Record<number, number>>({});

  const isLoading = loadTurmas || loadAulas || loadEventos;

  const vinculoAtual = resTurmas?.dados?.find(
    (v) => v.turma_id === turmaId && v.disciplina_id === disciplinaId,
  );

  const alunos = resMatriculas?.dados || [];
  const aulas = resAulas?.dados || [];
  const eventos = resEventos?.dados || [];

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

  const handleIncrementarFalta = (matriculaId: number) => {
    setFaltas((prev) => {
      const atual = prev[matriculaId] || 0;
      if (atual >= quantidadeAulas) return prev;
      return { ...prev, [matriculaId]: atual + 1 };
    });
  };

  const handleDecrementarFalta = (matriculaId: number) => {
    setFaltas((prev) => {
      const atual = prev[matriculaId] || 0;
      if (atual <= 0) return prev;
      return { ...prev, [matriculaId]: atual - 1 };
    });
  };

  const handleSalvarChamada = () => {
    if (!dataAula) return toast.error("Por favor, selecione a data da aula.");
    if (quantidadeAulas < 1)
      return toast.error("A quantidade de aulas deve ser pelo menos 1.");

    const listaFaltas = alunos.map((aluno) => ({
      matricula_id: aluno.id,
      numero_faltas: faltas[aluno.id] || 0,
    }));

    registrarFrequencia(
      {
        turma_id: turmaId,
        disciplina_id: disciplinaId,
        data_aula: new Date(dataAula),
        quantidade: quantidadeAulas,
        frequencias: listaFaltas,
      },
      {
        onSuccess: () => {
          setIsSheetOpen(false);
          setFaltas({});
          setDataAula("");
        },
      },
    );
  };

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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {vinculoAtual.turma.serie}º Ano {vinculoAtual.turma.identificacao}
            </h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">
              {vinculoAtual.disciplina.nome} •{" "}
              {vinculoAtual.quantidade_matriculas} alunos
            </p>
          </div>
        </div>
      </div>

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

      <div>
        {abaAtiva === "frequencia" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                <NotepadText size={24} className="text-zinc-500" />
                Histórico de Aulas
              </h2>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
                  >
                    <FaPlus />
                    Registrar nova frequência
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto border-none p-5">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Realizar Chamada</SheetTitle>
                    <SheetDescription>
                      Registre a data, quantidade de aulas dadas e as faltas.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data da Aula</Label>
                        <Input
                          type="date"
                          value={dataAula}
                          onChange={(e) => setDataAula(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Qtd. de Aulas</Label>
                        <NumberInput
                          allowNegative={false}
                          decimalScale={0}
                          min={1}
                          max={5}
                          value={quantidadeAulas}
                          onValueChange={(values) =>
                            setQuantidadeAulas(values.floatValue ?? 1)
                          }
                        />
                      </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-4">
                      <Label className="text-zinc-500 mb-4 block">
                        Lista de Alunos
                      </Label>
                      <div className="space-y-3">
                        {alunos.map((aluno) => {
                          const faltasAluno = faltas[aluno.id] || 0;
                          return (
                            <div
                              key={aluno.id}
                              className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl"
                            >
                              <span className="text-sm font-medium text-zinc-700 line-clamp-1 flex-1">
                                {aluno.aluno?.usuario?.nome || "Aluno sem nome"}
                              </span>

                              <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-zinc-200">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-zinc-400 hover:text-red-500"
                                  onClick={() =>
                                    handleDecrementarFalta(aluno.id)
                                  }
                                  disabled={faltasAluno === 0}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span
                                  className={`w-4 text-center font-bold text-sm ${faltasAluno > 0 ? "text-red-500" : "text-zinc-400"}`}
                                >
                                  {faltasAluno}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-zinc-400 hover:text-red-500"
                                  onClick={() =>
                                    handleIncrementarFalta(aluno.id)
                                  }
                                  disabled={faltasAluno >= quantidadeAulas}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="mt-8">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleSalvarChamada}
                      disabled={isSalvandoChamada}
                    >
                      {isSalvandoChamada ? "Salvando..." : "Salvar Chamada"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
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
                                new Date(aula.data_aula),
                                "dd 'de' MMMM, yyyy",
                                { locale: ptBR },
                              )}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {aula.quantidade} aula(s) ministrada(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {abaAtiva === "avaliacoes" && (
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

            <section className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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

            <section className="flex flex-col gap-4 mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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
        )}

        {abaAtiva === "alunos" && (
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
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                      {matricula.aluno?.usuario?.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p
                        className="font-semibold text-zinc-900 line-clamp-1"
                        title={matricula.aluno?.usuario?.nome}
                      >
                        {matricula.aluno?.usuario?.nome}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                        RA: {matricula.aluno?.usuario?.usuario}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
