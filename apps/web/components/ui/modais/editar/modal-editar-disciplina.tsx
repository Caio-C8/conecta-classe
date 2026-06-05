"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateDisciplinaSchema,
  UpdateDisciplinaInput,
  Disciplina,
} from "@repo/types";
import {
  useUpdateDisciplina,
  useInativarDisciplina,
  useAtivarDisciplina,
} from "@/hooks/use-disciplinas";
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

interface ModalEditarDisciplinaProps {
  disciplina: Disciplina;
}

export function ModalEditarDisciplina({
  disciplina,
}: ModalEditarDisciplinaProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateDisciplina, isPending: isUpdating } =
    useUpdateDisciplina();
  const { mutate: inativarDisciplina, isPending: isInativando } =
    useInativarDisciplina();
  const { mutate: ativarDisciplina, isPending: isAtivando } =
    useAtivarDisciplina();

  const isPending = isUpdating || isInativando || isAtivando;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateDisciplinaInput>({
    resolver: zodResolver(UpdateDisciplinaSchema),
    defaultValues: {
      nome: disciplina.nome,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({ nome: disciplina.nome });
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (values: UpdateDisciplinaInput) => {
    if (!disciplina) return;

    updateDisciplina(
      { id: disciplina.id, dados: values },
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
    if (!disciplina) return;

    if (disciplina.deleted_at) {
      ativarDisciplina(disciplina.id, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else {
      inativarDisciplina(disciplina.id, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="link cursor-pointer">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar disciplina
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Field>
            <FieldLabel htmlFor="nome">Nome:</FieldLabel>
            <Input
              id="nome"
              placeholder="Ex: Matemática, História"
              className={`bg-card text-[16px] sm:text-sm ${
                errors.nome
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
              {...register("nome")}
            />
            {errors.nome && <FieldError message={errors.nome.message} />}
          </Field>

          <hr className="my-2 border-t border-border" />

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                disabled={isPending}
                onClick={handleAtivarInativar}
                className={`w-full sm:w-auto text-white transition-colors ${
                  disciplina?.deleted_at
                    ? "bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                    : "bg-[#ef4444] hover:bg-[#ef4444]/90"
                }`}
              >
                {isAtivando || isInativando
                  ? "Aguarde..."
                  : disciplina?.deleted_at
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
