"use client";

import React, { useState } from "react";
import { useLogin } from "@/hooks/use-autenticacao";
import { Papel } from "@repo/types";

// Importações dos componentes do Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [papel, setPapel] = useState<Papel>(Papel.ALUNO);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const { mutate, isPending, error, isError } = useLogin();

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !senha) return;

    mutate({ usuario, senha, papel });
  };

  const getErrorMessage = (error: any) => {
    if (error.response?.data?.mensagem) {
      return error.response.data.mensagem;
    }
    return error.message || "Erro inesperado ao realizar o login.";
  };

  const papeis: Papel[] = [Papel.ALUNO, Papel.PROFESSOR, Papel.ADMINISTRADOR];

  return (
    // Trocado min-h-screen por min-h-[100dvh] para mobile
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Padding dinâmico: menor no mobile (p-4) e maior no desktop (sm:p-8) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-[540px] shadow-xl border-none">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">
              Selecione seu perfil e insira as credenciais{" "}
              <br className="hidden sm:block" /> para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue={papel}
              onValueChange={(value) => setPapel(value as Papel)}
              className="w-full mb-6"
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

            <form onSubmit={handleEntrar} className="flex flex-col gap-4">
              {isError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                  {getErrorMessage(error)}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="usuario">Usuário:</FieldLabel>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  // text-[16px] evita o zoom automático no iPhone
                  className="bg-card border-border text-[16px] sm:text-sm"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="senha">Senha:</FieldLabel>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  // text-[16px] evita o zoom automático no iPhone
                  className="bg-card border-border text-[16px] sm:text-sm"
                />
              </Field>

              <hr className="my-2 border-t border-border" />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold text-[0.9rem] sm:text-base py-5 sm:py-2"
              >
                {isPending ? "Autenticando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col pt-0 pb-6 sm:pb-8">
            <hr className="w-full border-t border-border mb-4" />
            <p className="text-[0.72rem] sm:text-xs text-muted-foreground text-center leading-relaxed px-2">
              Caso seja seu primeiro acesso ou tenha esquecido sua senha, entre
              em contato com a direção.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
