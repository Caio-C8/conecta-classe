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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field-error";
import { useRouter } from "next/navigation";

interface ModalCriarDisciplinaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirecionar?: boolean;
}

export function ModalCriarDisciplina({
  open,
  onOpenChange,
  redirecionar = false,
}: ModalCriarDisciplinaProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateDisciplina();

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
    onOpenChange(false);
  };

  const onSubmit = (values: CreateDisciplinaInput) => {
    mutate(values, {
      onSuccess: () => {
        if (redirecionar) {
          router.push("/admin/disciplinas");
        }
      },
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
