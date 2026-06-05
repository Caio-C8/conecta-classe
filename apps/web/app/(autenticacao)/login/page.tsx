import { LoginForm } from "@/features/autenticacao/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
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
            <LoginForm />
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
