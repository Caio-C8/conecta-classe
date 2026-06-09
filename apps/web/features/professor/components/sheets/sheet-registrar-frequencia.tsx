"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRegistrarFrequencia } from "@/features/professor/hooks/use-professor";
import { Matricula } from "@repo/types";

interface SheetRegistrarFrequenciaProps {
  turmaId: number;
  disciplinaId: number;
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

export function SheetRegistrarFrequencia({
  turmaId,
  disciplinaId,
  alunos,
}: SheetRegistrarFrequenciaProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditingChamada, setIsEditingChamada] = useState(false);
  const [dataAula, setDataAula] = useState(getLocalDateString(new Date())!);
  const [quantidadeAulas, setQuantidadeAulas] = useState(1);
  const [faltas, setFaltas] = useState<Record<number, number>>({});

  const { mutate: registrarFrequencia, isPending: isSalvandoChamada } =
    useRegistrarFrequencia();

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

  const handleNovaChamada = () => {
    setIsEditingChamada(false);
    setDataAula(getLocalDateString(new Date())!);
    setQuantidadeAulas(1);
    setFaltas({});
    setIsSheetOpen(true);
  };

  const handleEditarChamada = (aula: any) => {
    setIsEditingChamada(true);
    setDataAula(getLocalDateString(aula.data_aula)!);
    setQuantidadeAulas(aula.quantidade);

    const initialFaltas: Record<number, number> = {};
    if (aula.frequencias) {
      aula.frequencias.forEach((freq: any) => {
        initialFaltas[freq.matricula_id] = freq.numero_faltas;
      });
    }
    setFaltas(initialFaltas);
    setIsSheetOpen(true);
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

  return {
    isSheetOpen,
    handleNovaChamada,
    handleEditarChamada,
    SheetFrequencia: (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <Button
          size="lg"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
          onClick={handleNovaChamada}
        >
          <FaPlus />
          Registrar nova frequência
        </Button>
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
                  disabled={isEditingChamada}
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
                          onClick={() => handleDecrementarFalta(aluno.id)}
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
                          onClick={() => handleIncrementarFalta(aluno.id)}
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
    ),
  };
}
