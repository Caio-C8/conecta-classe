"use client";

import { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field-error";
import { setApiFormErrors } from "@/lib/utils-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useRegistrarFrequencia,
  useExcluirAula,
} from "@/features/professor/hooks/use-professor";
import {
  Matricula,
  RegistrarFrequenciaInput,
  RegistrarFrequenciaSchema,
} from "@repo/types";

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
  const [aulaIdEditando, setAulaIdEditando] = useState<number | null>(null);

  const { mutate: registrarFrequencia, isPending: isSalvandoChamada } =
    useRegistrarFrequencia();
  const { mutate: excluirAula, isPending: isExcluindoAula } = useExcluirAula();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<RegistrarFrequenciaInput>({
    resolver: zodResolver(RegistrarFrequenciaSchema),
    defaultValues: {
      turma_id: turmaId,
      disciplina_id: disciplinaId,
      data_aula: getLocalDateString(new Date()) as any,
      quantidade: 1,
      frequencias: alunos.map((a) => ({
        matricula_id: a.id,
        numero_faltas: 0,
      })),
    },
  });

  const { fields, update } = useFieldArray({
    control,
    name: "frequencias",
  });

  const quantidadeAulas = watch("quantidade");

  const handleIncrementarFalta = (index: number) => {
    const atual = fields[index].numero_faltas;
    const qtd = quantidadeAulas === null ? 0 : Number(quantidadeAulas);
    if (qtd === 0 || atual >= qtd) return;
    update(index, { ...fields[index], numero_faltas: atual + 1 });
  };

  const handleDecrementarFalta = (index: number) => {
    const atual = fields[index].numero_faltas;
    if (atual <= 0) return;
    update(index, { ...fields[index], numero_faltas: atual - 1 });
  };

  const handleNovaChamada = () => {
    setIsEditingChamada(false);
    setAulaIdEditando(null);
    reset({
      turma_id: turmaId,
      disciplina_id: disciplinaId,
      data_aula: getLocalDateString(new Date()) as any,
      quantidade: 1,
      frequencias: alunos.map((a) => ({
        matricula_id: a.id,
        numero_faltas: 0,
      })),
    });
    setIsSheetOpen(true);
  };

  const handleEditarChamada = (aula: any) => {
    setIsEditingChamada(true);
    setAulaIdEditando(aula.id);

    const freqMap: Record<number, number> = {};
    if (aula.frequencias) {
      aula.frequencias.forEach((freq: any) => {
        freqMap[freq.matricula_id] = freq.numero_faltas;
      });
    }

    reset({
      turma_id: turmaId,
      disciplina_id: disciplinaId,
      data_aula: getLocalDateString(aula.data_aula) as any,
      quantidade: aula.quantidade,
      frequencias: alunos.map((a) => ({
        matricula_id: a.id,
        numero_faltas: freqMap[a.id] || 0,
      })),
    });
    setIsSheetOpen(true);
  };

  const onSubmit = (values: RegistrarFrequenciaInput) => {
    const dataAulaObj = new Date(values.data_aula);

    registrarFrequencia(
      {
        ...values,
        data_aula: dataAulaObj,
      },
      {
        onSuccess: () => {
          setIsSheetOpen(false);
          reset();
        },
        onError: (error: any) => {
          setApiFormErrors(error, setError);
        },
      },
    );
  };

  const handleExcluirChamada = () => {
    if (!aulaIdEditando) return;

    excluirAula(aulaIdEditando, {
      onSuccess: () => {
        setIsSheetOpen(false);
        reset();
        setAulaIdEditando(null);
      },
    });
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="data_aula">Data da Aula</FieldLabel>
                <Input
                  id="data_aula"
                  type="date"
                  className={`bg-card text-[16px] sm:text-sm ${
                    errors.data_aula
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-border"
                  }`}
                  disabled={isEditingChamada}
                  max={getLocalDateString(new Date())!}
                  {...register("data_aula")}
                />
                {errors.data_aula && (
                  <FieldError message={errors.data_aula.message} />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="quantidade">Qtd. de Aulas</FieldLabel>
                <Controller
                  name="quantidade"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      id="quantidade"
                      allowNegative={false}
                      decimalScale={0}
                      min={1}
                      max={5}
                      value={field.value ?? ""}
                      onValueChange={(values) => {
                        field.onChange(
                          values.value === "" ? null : values.floatValue,
                        );
                      }}
                      className={`bg-card text-[16px] sm:text-sm ${
                        errors.quantidade
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-border"
                      }`}
                    />
                  )}
                />
                {errors.quantidade && (
                  <FieldError message={errors.quantidade.message} />
                )}
              </Field>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <Label className="text-zinc-500 mb-4 block">
                Lista de Alunos
              </Label>
              <div className="space-y-3">
                {fields.map((fieldItem, index) => {
                  const aluno = alunos.find(
                    (a) => a.id === fieldItem.matricula_id,
                  );
                  const faltasAluno = fieldItem.numero_faltas;

                  return (
                    <div
                      key={fieldItem.id}
                      className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl"
                    >
                      <span className="text-sm font-medium text-zinc-700 line-clamp-1 flex-1">
                        {aluno?.aluno?.usuario?.nome || "Aluno sem nome"}
                      </span>

                      <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-zinc-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-red-500"
                          onClick={() => handleDecrementarFalta(index)}
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
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-red-500"
                          onClick={() => handleIncrementarFalta(index)}
                          disabled={
                            quantidadeAulas === null ||
                            faltasAluno >= Number(quantidadeAulas)
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="mt-8 flex flex-col gap-3 sm:flex-col sm:space-x-0">
              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={isSalvandoChamada || isExcluindoAula}
              >
                {isSalvandoChamada ? "Salvando..." : "Salvar Chamada"}
              </Button>

              {isEditingChamada && aulaIdEditando && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isSalvandoChamada || isExcluindoAula}
                    >
                      {isExcluindoAula ? "Excluindo..." : "Excluir Chamada"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente a aula e todas as frequências
                        registradas neste dia.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleExcluirChamada}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sim, excluir chamada
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    ),
  };
}
