import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrocarSenhaForm } from "@/features/autenticacao/components/trocar-senha-form";
import Image from "next/image";
import Logo from "@/assets/logo.svg";

export default function AlterarSenhaPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 gap-10 flex-col">
        <div className="flex flex-col items-center">
          <Image
            src={Logo}
            alt="Logo Conecta Classe"
            width={128}
            height={128}
            className="mb-4"
            priority
          />
          <span className="text-2xl font-bold">
            Conecta<span className="font-medium">Classe</span>
          </span>
        </div>
        <Card className="w-full max-w-[540px] shadow-xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Altere sua senha
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">
              Preencha os campos com sua nova senha
              <br className="hidden sm:block" /> para ela ser alterada
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TrocarSenhaForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
