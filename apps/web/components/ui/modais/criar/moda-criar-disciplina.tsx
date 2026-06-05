"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDisciplinaSchema, CreateDisciplinaInput } from "@repo/types";
import { useCreateDisciplina } from "@/hooks/use-disciplinas";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface ModalCriarDisciplinaProps {
  redirecionar?: boolean;
}

export function ModalCriarDisciplina({
  redirecionar = false,
}: ModalCriarDisciplinaProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateDisciplina();

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateDisciplinaInput>({
    resolver: zodResolver(CreateDisciplinaSchema),
    defaultValues: {
      nome: undefined,
    },
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const onSubmit = (values: CreateDisciplinaInput) => {
    mutate(values, {
      onSuccess: () => {
        if (redirecionar) {
          router.push("/admin/disciplinas");
        }
        reset();
      },
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
        >
          <FaPlus />
          Nova disciplina
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Criar disciplina
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Field>
            <FieldLabel htmlFor="nome">Nome da disciplina:</FieldLabel>
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

          <DialogFooter className="flex sm:justify-between w-full">
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
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full sm:w-auto mt-2 sm:mt-0"
            >
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
