"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreateUsuarioSchema,
  CreateUsuarioInput,
  Papel,
  Cargo,
} from "@repo/types";
import { useCreateUsuario } from "@/hooks/use-usuarios";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface ModalCriarUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirecionar?: boolean;
}

type FormValues = {
  nome: string;
  usuario: string;
  senha: string;
  papel: Papel;
  trocar_senha: boolean;
  cargo?: Cargo;
};

export function ModalCriarUsuario({
  open,
  onOpenChange,
  redirecionar = false,
}: ModalCriarUsuarioProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateUsuario();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      CreateUsuarioSchema as z.ZodType<any, any, FormValues>,
    ),
    defaultValues: {
      nome: undefined,
      usuario: undefined,
      senha: undefined,
      papel: Papel.ALUNO,
      trocar_senha: true,
    },
  });

  const papelSelecionado = watch("papel");

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: FormValues) => {
    const dadosFormatados = values as CreateUsuarioInput;

    mutate(dadosFormatados, {
      onSuccess: () => {
        if (redirecionar) {
          router.push("/admin/usuarios");
        } else {
          handleClose();
        }
      },
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  const papeis = [Papel.ALUNO, Papel.PROFESSOR, Papel.ADMINISTRADOR];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar usuário</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Tabs
            value={papelSelecionado}
            onValueChange={(value) => {
              setValue("papel", value as Papel);
              if (value !== Papel.ADMINISTRADOR) {
                setValue("cargo", undefined);
              }
            }}
            className="w-full mb-2"
          >
            <TabsList className="flex w-full h-auto p-0.5 bg-transparent border border-border rounded-lg overflow-hidden">
              {papeis.map((p) => (
                <TabsTrigger
                  key={p}
                  value={p}
                  className="
                    flex-1 py-1.5 text-xs sm:text-sm transition-colors rounded-md shadow-none 
                    border-r border-border last:border-r-0 
                    data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground
                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none data-[state=active]:hover:text-primary-foreground
                  "
                >
                  {p.toLowerCase().charAt(0).toUpperCase() +
                    p.toLowerCase().slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="nome">Nome:</FieldLabel>
              <Input
                id="nome"
                placeholder="Nome"
                className={`bg-card text-[16px] sm:text-sm ${errors.nome ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                {...register("nome")}
              />
              {errors.nome && <FieldError message={errors.nome.message} />}
            </Field>

            <Field>
              <FieldLabel htmlFor="usuario">Usuário:</FieldLabel>
              <Input
                id="usuario"
                placeholder="Usuário"
                className={`bg-card text-[16px] sm:text-sm ${errors.usuario ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                {...register("usuario")}
              />
              {errors.usuario && (
                <FieldError message={errors.usuario.message} />
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="senha">Senha:</FieldLabel>
            <PasswordInput
              id="senha"
              placeholder="Senha"
              className={`bg-card text-[16px] sm:text-sm ${errors.senha ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
              {...register("senha")}
            />
            {errors.senha && <FieldError message={errors.senha.message} />}
          </Field>

          <div className="flex items-center space-x-2">
            <Controller
              name="trocar_senha"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="trocar_senha"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label
              htmlFor="trocar_senha"
              className="text-xs font-medium text-muted-foreground cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Editar senha no primeiro acesso
            </label>
          </div>

          {papelSelecionado === Papel.ADMINISTRADOR && (
            <Field>
              <FieldLabel htmlFor="cargo">Cargo:</FieldLabel>
              <Controller
                name="cargo"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="cargo"
                      className={`bg-card text-[16px] sm:text-sm ${errors.cargo ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                    >
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Cargo.DIRETORA}>Diretor(a)</SelectItem>
                      <SelectItem value={Cargo.SECRETARIA}>
                        Secretário(a)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cargo && <FieldError message={errors.cargo.message} />}
            </Field>
          )}

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
