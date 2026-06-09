"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventoInput, CreateEventoSchema, TipoEvento } from "@repo/types";
import { useCreateEvento } from "@/features/professor/hooks/use-professor";
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
import { FaPlus } from "react-icons/fa";

interface ModalCriarEventoProps {
  turmaId: number;
  disciplinaId: number;
  estiloTrigger?: "link" | "button";
}

export function ModalCriarEvento({
  turmaId,
  disciplinaId,
  estiloTrigger = "button",
}: ModalCriarEventoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createEvento, isPending: isCriando } = useCreateEvento();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateEventoInput>({
    resolver: zodResolver(CreateEventoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      data_evento: undefined,
      valor_nota: undefined,
      tipo_evento: undefined,
      turma_id: turmaId,
      disciplina_id: disciplinaId,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({
        titulo: "",
        descricao: "",
        data_evento: undefined,
        valor_nota: undefined,
        tipo_evento: undefined,
        turma_id: turmaId,
        disciplina_id: disciplinaId,
      });
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (values: CreateEventoInput) => {
    createEvento(
      { ...values, turma_id: turmaId, disciplina_id: disciplinaId },
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {estiloTrigger === "link" ? (
          <Button variant="link" className="link cursor-pointer">
            Novo evento
          </Button>
        ) : estiloTrigger === "button" ? (
          <Button
            size="lg"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
          >
            <FaPlus />
            Registrar novo evento
          </Button>
        ) : (
          <Button variant="ghost" className="cursor-pointer">
            Novo evento
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Novo evento</DialogTitle>
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

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end w-full gap-2">
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
              disabled={isCriando}
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full sm:w-auto"
            >
              {isCriando ? "Criando..." : "Criar evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
