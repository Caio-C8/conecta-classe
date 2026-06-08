"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMatriculasCursando,
  useEvento,
  useRegistrarNotas,
} from "@/features/professor/hooks/use-professor";

interface SheetLancarNotasProps {
  eventoId: number;
  turmaId: number;
  tituloEvento: string;
  valorNota?: number | null;
  children: React.ReactNode;
}

export function SheetLancarNotas({
  eventoId,
  turmaId,
  tituloEvento,
  valorNota,
  children,
}: SheetLancarNotasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notas, setNotas] = useState<Record<number, string>>({});

  const { data: resMatriculas, isLoading: loadMatriculas } =
    useMatriculasCursando(turmaId, isOpen);
  const { data: resEvento, isLoading: loadEvento } = useEvento(
    eventoId,
    isOpen,
  );

  const { mutate: registrarNotas, isPending: isSalvando } = useRegistrarNotas();

  const alunos = resMatriculas?.dados || [];
  const notasSalvas = resEvento?.dados?.notas_eventos ?? [];
  const isLoading = loadMatriculas || loadEvento;

  const notasSalvasKey = JSON.stringify(notasSalvas);

  useEffect(() => {
    if (isOpen) {
      if (notasSalvas.length > 0) {
        const notasIniciais: Record<number, string> = {};
        notasSalvas.forEach((n: any) => {
          if (n.nota_obtida !== null && n.nota_obtida !== undefined) {
            notasIniciais[n.matricula_id] = String(n.nota_obtida);
          }
        });
        setNotas(notasIniciais);
      }
    } else {
      setNotas((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    }
  }, [isOpen, notasSalvasKey]);

  const handleNotaChange = (matriculaId: number, valor: string) => {
    setNotas((prev) => ({ ...prev, [matriculaId]: valor }));
  };

  const handleSalvar = () => {
    let temErro = false;

    const notasParaSalvar = alunos
      .map((aluno) => {
        const valorRaw = notas[aluno.id];

        if (!valorRaw || valorRaw.trim() === "") return null;

        const notaNumerica = Number(valorRaw.replace(",", "."));

        if (isNaN(notaNumerica) || notaNumerica < 0) {
          temErro = true;
        }

        if (
          valorNota !== null &&
          valorNota !== undefined &&
          notaNumerica > Number(valorNota)
        ) {
          temErro = true;
        }

        return {
          matricula_id: aluno.id,
          nota_obtida: notaNumerica,
        };
      })
      .filter(Boolean) as { matricula_id: number; nota_obtida: number }[];

    if (temErro) {
      return toast.error(
        `Algumas notas são inválidas ou maiores que o máximo permitido (${valorNota}).`,
      );
    }

    if (notasParaSalvar.length === 0) {
      return toast.error("Preencha ao menos uma nota para salvar.");
    }

    registrarNotas(
      {
        eventoId,
        dados: { notas: notasParaSalvar },
      },
      {
        onSuccess: () => setIsOpen(false),
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-none p-5">
        <SheetHeader className="mb-6">
          <SheetTitle>Diário de Notas</SheetTitle>
          <SheetDescription className="line-clamp-2">
            Lançamento para: <strong>{tituloEvento}</strong>
          </SheetDescription>
          {valorNota !== null && valorNota !== undefined && (
            <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold w-max border border-blue-100">
              Valor Máximo: {Number(valorNota).toFixed(1)} pontos
            </div>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            <Label className="text-zinc-500 mb-2 block">Lista de Alunos</Label>

            {alunos.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                Nenhum aluno matriculado nesta turma.
              </p>
            ) : (
              <div className="space-y-2">
                {alunos.map((aluno) => {
                  const notaAtual = notas[aluno.id] || "";
                  const notaInvalida =
                    valorNota &&
                    Number(notaAtual.replace(",", ".")) > Number(valorNota);

                  return (
                    <div
                      key={aluno.id}
                      className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-transparent hover:border-zinc-200 transition-colors"
                    >
                      <span className="text-sm font-medium text-zinc-700 line-clamp-1 flex-1 pr-4">
                        {aluno.aluno?.usuario?.nome || "Aluno sem nome"}
                      </span>

                      <div className="w-24">
                        <Input
                          type="text"
                          placeholder="Ex: 8.5"
                          value={notaAtual}
                          onChange={(e) =>
                            handleNotaChange(aluno.id, e.target.value)
                          }
                          className={`h-9 text-center font-semibold bg-white ${
                            notaInvalida
                              ? "border-red-500 text-red-600 focus-visible:ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <SheetFooter className="mt-8">
          <Button
            className="w-full bg-zinc-900 hover:bg-zinc-800"
            onClick={handleSalvar}
            disabled={isSalvando || isLoading}
          >
            {isSalvando ? "Salvando..." : "Salvar Diário de Notas"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
