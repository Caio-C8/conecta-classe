"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Resposta, RespostaGetRendimentosAluno } from "@repo/types";

// --- CHAVES DE CACHE ---
export const RENDIMENTOS_ALUNO_QUERY_KEY = ["rendimentos", "aluno", "me"];

// --- FETCHER ---
async function getRendimentosAluno(
  anoLetivo: number,
): Promise<Resposta<RespostaGetRendimentosAluno>> {
  const response = await api.get<Resposta<RespostaGetRendimentosAluno>>(
    `/rendimentos/me/${anoLetivo}`,
  );
  return response.data;
}

// --- HOOK ---
export function useRendimentosAluno(
  anoLetivo: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...RENDIMENTOS_ALUNO_QUERY_KEY, anoLetivo],
    queryFn: () => getRendimentosAluno(anoLetivo),
    enabled: !!anoLetivo && enabled,
  });
}
