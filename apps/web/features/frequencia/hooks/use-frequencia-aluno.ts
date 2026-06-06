"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Resposta, RespostaGetFrequenciaAluno } from "@repo/types";

// --- CHAVES DE CACHE ---
export const FREQUENCIA_ALUNO_QUERY_KEY = ["frequencia", "aluno", "me"];

// --- FETCHER ---
async function getFrequenciaAluno(
  anoLetivo: number,
): Promise<Resposta<RespostaGetFrequenciaAluno>> {
  const response = await api.get<Resposta<RespostaGetFrequenciaAluno>>(
    `/frequencias/me/${anoLetivo}`,
  );
  return response.data;
}

// --- HOOK ---
export function useFrequenciaAluno(anoLetivo: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...FREQUENCIA_ALUNO_QUERY_KEY, anoLetivo],
    queryFn: () => getFrequenciaAluno(anoLetivo),
    enabled: !!anoLetivo && enabled,
  });
}
