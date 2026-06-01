"use client";

import React, { useState } from "react";
import { useTrocarSenha } from "@/hooks/use-autenticacao";

// Importações dos componentes do Shadcn e o novo PasswordInput
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input"; // <-- Ajuste o caminho se necessário

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, error, isError } = useTrocarSenha();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) return;

    if (novaSenha !== confirmarSenha) {
      setValidationError("A nova senha e a confirmação não coincidem.");
      return;
    }

    mutate({
      senha_atual: senhaAtual,
      nova_senha: novaSenha,
      confirmar_senha: confirmarSenha,
    });
  };

  const getErrorMessage = (error: any) => {
    if (error?.response?.data?.mensagem) {
      return error.response.data.mensagem;
    }
    return error?.message || "Erro inesperado ao alterar a senha.";
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {(validationError || isError) && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                  {validationError ?? getErrorMessage(error)}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="senhaAtual">Senha atual:</FieldLabel>
                <PasswordInput
                  id="senhaAtual"
                  placeholder="Sua senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                  className="bg-card border-border text-[16px] sm:text-sm"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="novaSenha">Nova senha:</FieldLabel>
                <PasswordInput
                  id="novaSenha"
                  placeholder="Sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className="bg-card border-border text-[16px] sm:text-sm"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmarSenha">
                  Confirmar senha:
                </FieldLabel>
                <PasswordInput
                  id="confirmarSenha"
                  placeholder="Digite novamente sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="bg-card border-border text-[16px] sm:text-sm"
                />
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
