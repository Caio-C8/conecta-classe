import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrocarSenhaForm } from "@/features/autenticacao/components/trocar-senha-form";

export default function AlterarSenhaPage() {
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
            {/* O formulário interativo (Client Component) é montado aqui */}
            <TrocarSenhaForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
