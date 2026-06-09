"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Evento,
  UpdateEventoInput,
  UpdateEventoSchema,
  TipoEvento,
} from "@repo/types";
import {
  useUpdateEvento,
  useExcluirEvento,
  useEvento,
} from "@/features/professor/hooks/use-professor";
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
import { Textarea } from "@/components/ui/textarea";
import { SquarePen } from "lucide-react";

interface ModalEditarEventoProps {
  evento: Evento;
  estiloTrigger?: "link" | "button";
}

export function ModalEditarEvento({
  evento,
  estiloTrigger = "link",
}: ModalEditarEventoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateEvento, isPending: isUpdating } = useUpdateEvento();
  const { mutate: excluirEvento, isPending: isExcluindo } = useExcluirEvento();
  const { data: resEvento } = useEvento(evento.id);

  const isPending = isUpdating || isExcluindo;

  const notasLancadas = resEvento?.dados?.notas_eventos ?? [];
  const possuiNotasLancadas = notasLancadas.length > 0;

  const formatDateForInput = (date: Date | string) => {
    if (typeof date === "string") {
      if (date.includes("T")) return date.split("T")[0];
      return date;
    }
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateEventoSchema),
    defaultValues: {
      titulo: evento.titulo,
      descricao: evento.descricao,
      data_evento: formatDateForInput(evento.data_evento) as any,
      valor_nota: evento.valor_nota ?? undefined,
      tipo_evento: evento.tipo_evento,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({
        titulo: evento.titulo,
        descricao: evento.descricao,
        data_evento: formatDateForInput(evento.data_evento) as any,
        valor_nota: evento.valor_nota ?? undefined,
        tipo_evento: evento.tipo_evento,
      });
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (values: UpdateEventoInput) => {
    updateEvento(
      { id: evento.id, dados: values },
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

  const handleExcluir = () => {
    excluirEvento(evento.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {estiloTrigger === "link" ? (
          <Button variant="link" className="link cursor-pointer">
            Editar
          </Button>
        ) : estiloTrigger === "button" ? (
          <Button variant="outline">
            <SquarePen />
            Editar evento
          </Button>
        ) : (
          <Button variant="ghost" className="cursor-pointer">
            Editar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar evento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Field>
            <FieldLabel htmlFor="titulo">Título:</FieldLabel>
            <Input
              id="titulo"
              placeholder="Ex: Prova Bimestral, Trabalho em Grupo"
              className={`bg-card text-[16px] sm:text-sm ${
                errors.titulo
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
              {...register("titulo")}
            />
            {errors.titulo && <FieldError message={errors.titulo.message} />}
          </Field>

          <Field>
            <FieldLabel htmlFor="descricao">Descrição:</FieldLabel>
            <Textarea
              id="descricao"
              placeholder="Descreva o evento..."
              rows={3}
              className={`bg-card text-[16px] sm:text-sm resize-none ${
                errors.descricao
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
              {...register("descricao")}
            />
            {errors.descricao && (
              <FieldError message={errors.descricao.message} />
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="tipo_evento">Tipo de Evento:</FieldLabel>
              <Controller
                name="tipo_evento"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} key={isOpen ? "open" : "closed"}>
                    <SelectTrigger
                      id="tipo_evento"
                      className={`bg-card text-[16px] sm:text-sm ${
                        errors.tipo_evento
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-border"
                      }`}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TipoEvento.PROVA}>Prova</SelectItem>
                      <SelectItem value={TipoEvento.ATIVIDADE}>
                        Atividade
                      </SelectItem>
                      <SelectItem value={TipoEvento.AVISO}>Aviso</SelectItem>
                      <SelectItem value={TipoEvento.GERAL}>Geral</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_evento && (
                <FieldError message={errors.tipo_evento.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="valor_nota">
                Valor da Nota (opcional):
              </FieldLabel>
              <Controller
                name="valor_nota"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    id="valor_nota"
                    placeholder="Ex: 10.0"
                    allowNegative={false}
                    decimalScale={2}
                    value={field.value ?? ""}
                    onValueChange={(values) => {
                      field.onChange(values.value === "" ? null : values.floatValue);
                    }}
                    className={`bg-card text-[16px] sm:text-sm ${
                      errors.valor_nota
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-border"
                    }`}
                  />
                )}
              />
              {errors.valor_nota && (
                <FieldError message={errors.valor_nota.message} />
              )}
              {possuiNotasLancadas && (
                <p className="text-xs text-amber-600 mt-1">
                  Notas já foram lançadas para este evento. O novo valor não pode
                  ser menor que a maior nota atribuída.
                </p>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="data_evento">Data do Evento:</FieldLabel>
            <Input
              id="data_evento"
              type="date"
              className={`bg-card text-[16px] sm:text-sm ${
                errors.data_evento
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
              {...register("data_evento")}
            />
            {errors.data_evento && (
              <FieldError message={errors.data_evento.message} />
            )}
          </Field>

          <hr className="my-2 border-t border-border" />

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                disabled={isPending}
                onClick={handleExcluir}
                className="w-full sm:w-auto bg-[#ef4444] hover:bg-[#ef4444]/90 text-white transition-colors"
              >
                {isExcluindo ? "Excluindo..." : "Excluir evento"}
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
