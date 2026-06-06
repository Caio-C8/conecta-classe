"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMatriculasAluno } from "@/features/matricula/hooks/use-matriculas-aluno";

interface AnoLetivoContextData {
  anoLetivo: number | null;
  setAnoLetivo: (ano: number) => void;
  anosDisponiveis: number[];
  isLoadingAnos: boolean;
}

const AnoLetivoContext = createContext<AnoLetivoContextData>(
  {} as AnoLetivoContextData,
);

export function AnoLetivoProvider({ children }: { children: ReactNode }) {
  const [anoLetivo, setAnoLetivo] = useState<number | null>(null);

  const { data, isLoading: isLoadingAnos } = useMatriculasAluno();

  const anosDisponiveis = data?.dados.map((m) => m.ano_letivo) || [];

  useEffect(() => {
    if (anosDisponiveis.length > 0 && !anoLetivo) {
      setAnoLetivo(anosDisponiveis[0]);
    }
  }, [anosDisponiveis, anoLetivo]);

  return (
    <AnoLetivoContext.Provider
      value={{ anoLetivo, setAnoLetivo, anosDisponiveis, isLoadingAnos }}
    >
      {children}
    </AnoLetivoContext.Provider>
  );
}

export const useAnoLetivo = () => useContext(AnoLetivoContext);
