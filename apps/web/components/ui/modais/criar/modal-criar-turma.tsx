"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTurmaSchema, CreateTurmaInput, NivelEnsino } from "@repo/types";
import { useCreateTurma } from "@/hooks/use-turmas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { NumberInput } from "../../number-input";

interface ModalCriarTurmaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirecionar?: boolean;
}

export function ModalCriarTurma({
  open,
  onOpenChange,
  redirecionar = true,
}: ModalCriarTurmaProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateTurma();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateTurmaInput>({
    resolver: zodResolver(CreateTurmaSchema),
    defaultValues: {
      identificacao: undefined,
      sala: undefined,
      serie: undefined,
      nivel_ensino: undefined,
      ano_letivo: new Date().getFullYear(),
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: CreateTurmaInput) => {
    mutate(values, {
      onSuccess: () => {
        if (redirecionar) {
          router.push("/admin/turmas");
        } else {
          handleClose();
        }
      },
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar turma</DialogTitle>
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
                placeholder="Ex: A, B, Única"
                className={`bg-card text-[16px] sm:text-sm ${errors.identificacao ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
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
