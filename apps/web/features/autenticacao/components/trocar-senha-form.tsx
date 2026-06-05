"use client";

import { useTrocarSenha } from "@/features/autenticacao/hooks/use-autenticacao";
import { TrocarSenhaInput, TrocarSenhaSchema } from "@repo/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setApiFormErrors } from "@/lib/utils-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { FieldError } from "@/components/ui/field-error";

export function TrocarSenhaForm() {
  const { mutate, isPending } = useTrocarSenha();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TrocarSenhaInput>({
    resolver: zodResolver(TrocarSenhaSchema),
    defaultValues: {
      senha_atual: undefined,
      nova_senha: undefined,
      confirmar_senha: undefined,
    },
  });

  const onSubmit = (values: TrocarSenhaInput) => {
    mutate(values, {
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="senha_atual">Senha atual:</FieldLabel>
        <PasswordInput
          id="senha_atual"
          placeholder="Sua senha atual"
          className={`bg-card text-[16px] sm:text-sm ${
            errors.senha_atual
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border"
          }`}
          {...register("senha_atual")}
        />
        {errors.senha_atual && (
          <FieldError message={errors.senha_atual.message} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="nova_senha">Nova senha:</FieldLabel>
        <PasswordInput
          id="nova_senha"
          placeholder="Sua nova senha"
          className={`bg-card text-[16px] sm:text-sm ${
            errors.nova_senha
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border"
          }`}
          {...register("nova_senha")}
        />
        {errors.nova_senha && (
          <FieldError message={errors.nova_senha.message} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmar_senha">Confirmar senha:</FieldLabel>
        <PasswordInput
          id="confirmar_senha"
          placeholder="Digite novamente sua senha"
          className={`bg-card text-[16px] sm:text-sm ${
            errors.confirmar_senha
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border"
          }`}
          {...register("confirmar_senha")}
        />
        {errors.confirmar_senha && (
          <FieldError message={errors.confirmar_senha.message} />
        )}
      </Field>

      <hr className="my-2 border-t border-border" />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-semibold text-[0.9rem] sm:text-base py-5 sm:py-2"
      >
        {isPending ? "Alterando..." : "Alterar senha e Entrar"}
      </Button>
    </form>
  );
}
