"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Cargo,
  Papel,
  UpdateUsuarioInput,
  UpdateUsuarioSchema,
  UsuarioSemSenha,
} from "@repo/types";
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
import {
  useAtivarUsuario,
  useInativarUsuario,
  useUpdateUsuario,
} from "@/features/usuario/hooks/use-usuarios";
import { SquarePen } from "lucide-react";

interface ModalEditarUsuarioProps {
  usuario: UsuarioSemSenha;
  estiloTrigger?: "link" | "button";
}

type FormValues = {
  nome: string;
  usuario: string;
  senha?: string;
  trocar_senha: boolean;
  cargo?: Cargo;
};

export function ModalEditarUsuario({
  usuario,
  estiloTrigger = "link",
}: ModalEditarUsuarioProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateUsuario, isPending: isUpdating } = useUpdateUsuario();
  const { mutate: inativarUsuario, isPending: isInativando } =
    useInativarUsuario();
  const { mutate: ativarUsuario, isPending: isAtivando } = useAtivarUsuario();

  const isPending = isUpdating || isInativando || isAtivando;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      UpdateUsuarioSchema as z.ZodType<any, any, FormValues>,
    ),
    defaultValues: {
      nome: usuario.nome,
      usuario: usuario.usuario,
      senha: "",
      cargo:
        usuario.papel === Papel.ADMINISTRADOR
          ? usuario.administrador?.cargo
          : undefined,
      trocar_senha: usuario.trocar_senha,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({
        nome: usuario.nome,
        usuario: usuario.usuario,
        senha: "",
        cargo:
          usuario.papel === Papel.ADMINISTRADOR
            ? usuario.administrador?.cargo
            : undefined,
        trocar_senha: usuario.trocar_senha,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (values: FormValues) => {
    if (!usuario) return;

    updateUsuario(
      { id: usuario.id, dados: values as UpdateUsuarioInput },
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
    if (!usuario) return;

    if (usuario.deleted_at) {
      ativarUsuario(usuario.id, {
        onSuccess: () => handleClose(),
      });
    } else {
      inativarUsuario(usuario.id, {
        onSuccess: () => handleClose(),
      });
    }
  };

  const papeis = [Papel.ALUNO, Papel.PROFESSOR, Papel.ADMINISTRADOR];

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
            Editar usuário
          </Button>
        ) : (
          <Button variant="ghost" className="cursor-pointer">
            Editar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar usuário
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="pointer-events-none opacity-90">
            <Tabs value={usuario.papel} className="w-full mb-2">
              <TabsList className="flex w-full h-auto p-0.5 bg-transparent border border-border rounded-lg overflow-hidden">
                {papeis.map((p) => (
                  <TabsTrigger
                    key={p}
                    value={p}
                    disabled
                    className="
                      flex-1 py-1.5 text-xs sm:text-sm transition-colors rounded-md shadow-none 
                      border-r border-border last:border-r-0 
                      data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground
                      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-none
                    "
                  >
                    {p.toLowerCase().charAt(0).toUpperCase() +
                      p.toLowerCase().slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="nome">Nome:</FieldLabel>
              <Input
                id="nome"
                placeholder="Nome"
                className={`bg-card text-[16px] sm:text-sm ${
                  errors.nome
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border"
                }`}
                {...register("nome")}
              />
              {errors.nome && <FieldError message={errors.nome.message} />}
            </Field>

            <Field>
              <FieldLabel htmlFor="usuario">Usuário:</FieldLabel>
              <Input
                id="usuario"
                placeholder="Usuário"
                className={`bg-card text-[16px] sm:text-sm ${
                  errors.usuario
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border"
                }`}
                {...register("usuario")}
              />
              {errors.usuario && (
                <FieldError message={errors.usuario.message} />
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="senha">Nova Senha (Opcional):</FieldLabel>
            <PasswordInput
              id="senha"
              placeholder="Digite apenas se quiser alterar"
              className={`bg-card text-[16px] sm:text-sm ${
                errors.senha
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border"
              }`}
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
              Exigir alteração de senha no próximo acesso
            </label>
          </div>

          {/* Renderização condicional visual usando a prop 'usuario' */}
          {usuario.papel === Papel.ADMINISTRADOR && (
            <Field>
              <FieldLabel htmlFor="cargo">Cargo:</FieldLabel>
              <Controller
                name="cargo"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="cargo"
                      className={`bg-card text-[16px] sm:text-sm ${
                        errors.cargo
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-border"
                      }`}
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

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                disabled={isPending}
                onClick={handleAtivarInativar}
                className={`w-full sm:w-auto text-white transition-colors ${
                  usuario?.deleted_at
                    ? "bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                    : "bg-[#ef4444] hover:bg-[#ef4444]/90"
                }`}
              >
                {isAtivando || isInativando
                  ? "Aguarde..."
                  : usuario?.deleted_at
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
