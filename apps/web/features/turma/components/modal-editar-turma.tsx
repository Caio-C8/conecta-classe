"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Turma,
  UpdateTurmaInput,
  UpdateTurmaSchema,
  NivelEnsino,
} from "@repo/types";
import {
  useUpdateTurma,
  useInativarTurma,
  useAtivarTurma,
} from "@/features/turma/hooks/use-turmas";
import { setApiFormErrors } from "@/lib/utils-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field-error";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SquarePen } from "lucide-react";

interface ModalEditarTurmaProps {
  turma: Turma;
  estiloTrigger?: "link" | "button";
}

export function ModalEditarTurma({
  turma,
  estiloTrigger = "link",
}: ModalEditarTurmaProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateTurma, isPending: isUpdating } = useUpdateTurma();
  const { mutate: inativarTurma, isPending: isInativando } = useInativarTurma();
  const { mutate: ativarTurma, isPending: isAtivando } = useAtivarTurma();

  const isPending = isUpdating || isInativando || isAtivando;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateTurmaInput>({
    resolver: zodResolver(UpdateTurmaSchema),
    defaultValues: {
      identificacao: turma.identificacao,
      serie: turma.serie,
      nivel_ensino: turma.nivel_ensino,
      sala: turma.sala,
      ano_letivo: turma.ano_letivo,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({
        identificacao: turma.identificacao,
        serie: turma.serie,
        nivel_ensino: turma.nivel_ensino,
        sala: turma.sala,
        ano_letivo: turma.ano_letivo,
      });
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (values: UpdateTurmaInput) => {
    if (!turma) return;

    updateTurma(
      { id: turma.id, dados: values },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error: any) => {
          setApiFormErrors(error, setError);
        },
      },
    );
  };

  const handleAtivarInativar = () => {
    if (!turma) return;

    if (turma.deleted_at) {
      ativarTurma(turma.id, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else {
      inativarTurma(turma.id, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {estiloTrigger === "link" ? (
          <Button variant="link" className="link cursor-pointer">
            Editar
          </Button>
        ) : estiloTrigger === "button" ? (
          <Button
            size="lg"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white px-6 py-6 text-base cursor-pointer"
          >
            <SquarePen />
            Editar turma
          </Button>
        ) : (
          <Button variant="ghost" className="cursor-pointer">
            Editar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar turma</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="identificacao">Identificação:</FieldLabel>
              <Input
                id="identificacao"
                placeholder="Ex: 101, 202"
                className={`bg-card text-[16px] sm:text-sm ${
                  errors.identificacao
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border"
                }`}
                {...register("identificacao")}
              />
              {errors.identificacao && (
                <FieldError message={errors.identificacao.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="serie">Série/Ano:</FieldLabel>
              <NumberInput
                id="serie"
                placeholder="Ex: 1, 9"
                allowNegative={false}
                decimalScale={0}
                className={`bg-card text-[16px] sm:text-sm ${errors.serie ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                {...register("serie")}
              />
              {errors.serie && <FieldError message={errors.serie.message} />}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="nivel_ensino">Nível de Ensino:</FieldLabel>
              <Controller
                name="nivel_ensino"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="nivel_ensino"
                      className={`bg-card text-[16px] sm:text-sm ${errors.nivel_ensino ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                    >
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NivelEnsino.FUNDAMENTAL_1}>
                        Fundamental I
                      </SelectItem>
                      <SelectItem value={NivelEnsino.FUNDAMENTAL_2}>
                        Fundamental II
                      </SelectItem>
                      <SelectItem value={NivelEnsino.MEDIO}>
                        Ensino Médio
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.nivel_ensino && (
                <FieldError message={errors.nivel_ensino.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="ano_letivo">Ano Letivo:</FieldLabel>
              <NumberInput
                id="ano_letivo"
                placeholder="Ex: 2026"
                allowNegative={false}
                decimalScale={0}
                className={`bg-card text-[16px] sm:text-sm ${errors.ano_letivo ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                {...register("ano_letivo")}
              />
              {errors.ano_letivo && (
                <FieldError message={errors.ano_letivo.message} />
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="sala">Sala:</FieldLabel>
            <Input
              id="sala"
              placeholder="Ex: Sala 101, Laboratório 2"
              className={`bg-card text-[16px] sm:text-sm ${errors.sala ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
              {...register("sala")}
            />
            {errors.sala && <FieldError message={errors.sala.message} />}
          </Field>
          <hr className="my-2 border-t border-border" />

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                disabled={isPending}
                onClick={handleAtivarInativar}
                className={`w-full sm:w-auto text-white transition-colors ${
                  turma?.deleted_at
                    ? "bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                    : "bg-[#ef4444] hover:bg-[#ef4444]/90"
                }`}
              >
                {isAtivando || isInativando
                  ? "Aguarde..."
                  : turma?.deleted_at
                    ? "Ativar"
                    : "Inativar"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full sm:w-auto"
              >
                {isUpdating ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
