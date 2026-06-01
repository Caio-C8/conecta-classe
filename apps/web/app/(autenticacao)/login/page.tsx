"use client";

import { useLogin } from "@/hooks/use-autenticacao";
import { LoginInput, LoginSchema, Papel } from "@repo/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setApiFormErrors } from "@/lib/utils-form";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      usuario: "",
      senha: "",
      papel: Papel.ALUNO,
    },
  });

  const onSubmit = (values: LoginInput) => {
    mutate(values, {
      onError: (error: any) => {
        setApiFormErrors(error, setError);
      },
    });
  };

  const papeis: Papel[] = [Papel.ALUNO, Papel.PROFESSOR, Papel.ADMINISTRADOR];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Tabs
                value={watch("papel")}
                onValueChange={(value) => setValue("papel", value as Papel)}
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

              <Field>
                <FieldLabel htmlFor="usuario">Usuário:</FieldLabel>
                <Input
                  id="usuario"
                  placeholder="Seu nome de usuário"
                  className={`bg-card text-[16px] sm:text-sm ${errors.usuario ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                  {...register("usuario")}
                />
                {errors.usuario && (
                  <span className="text-xs text-destructive font-medium mt-1">
                    {errors.usuario.message}
                  </span>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="senha">Senha:</FieldLabel>
                <PasswordInput
                  id="senha"
                  placeholder="Sua senha"
                  className={`bg-card text-[16px] sm:text-sm ${errors.senha ? "border-destructive focus-visible:ring-destructive" : "border-border"}`}
                  {...register("senha")}
                />
                {errors.senha && (
                  <span className="text-xs text-destructive font-medium mt-1">
                    {errors.senha.message}
                  </span>
                )}
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
