"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Resposta, Evento } from "@repo/types";

// --- CHAVES DE CACHE ---
export const EVENTOS_ALUNO_QUERY_KEY = ["eventos", "aluno", "me"];

// --- FETCHER ---
async function getEventosAluno(anoLetivo: number): Promise<Resposta<Evento[]>> {
  const response = await api.get<Resposta<Evento[]>>(
    `/eventos/me/${anoLetivo}`,
  );
  return response.data;
}

// --- HOOK ---
export function useEventosAluno(anoLetivo: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...EVENTOS_ALUNO_QUERY_KEY, anoLetivo],
    queryFn: () => getEventosAluno(anoLetivo),
    enabled: !!anoLetivo && enabled,
  });
}
