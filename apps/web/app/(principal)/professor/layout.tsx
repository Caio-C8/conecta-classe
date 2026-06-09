import { ReactNode } from "react";
import { AnoLetivoProvider } from "@/features/professor/contexts/ano-letivo-context";

export default function ProfessorLayout({ children }: { children: ReactNode }) {
  return <AnoLetivoProvider>{children}</AnoLetivoProvider>;
}
