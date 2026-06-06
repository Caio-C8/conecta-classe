import { AnoLetivoProvider } from "@/features/aluno/contexts/ano-letivo-context";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnoLetivoProvider>{children}</AnoLetivoProvider>;
}
