"use client";

import React from "react";
import { useTrocarSenha } from "@/hooks/use-autenticacao";
import { TrocarSenhaInput, TrocarSenhaSchema } from "@repo/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setApiFormErrors } from "@/lib/utils-form"; // Ajuste o caminho conforme onde você salvou a util

// Importações dos componentes
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

export default function AlterarSenhaPage() {
  const { mutate, isPending } = useTrocarSenha();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TrocarSenhaInput>({
    resolver: zodResolver(TrocarSenhaSchema),
    defaultValues: {
      senha_atual: "",
      nova_senha: "",
      confirmar_senha: "",
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
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-[540px] shadow-xl border-none">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">
              Altere sua senha
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">
              Preencha os campos com sua nova senha
              <br className="hidden sm:block" /> para ela ser alterada
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
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
                  <span className="text-xs text-destructive font-medium mt-1">
                    {errors.senha_atual.message}
                  </span>
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
                  <span className="text-xs text-destructive font-medium mt-1">
                    {errors.nova_senha.message}
                  </span>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmar_senha">
                  Confirmar senha:
                </FieldLabel>
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
                  <span className="text-xs text-destructive font-medium mt-1">
                    {errors.confirmar_senha.message}
                  </span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
