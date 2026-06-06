"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Matricula, Resposta } from "@repo/types";

// --- CHAVES DE CACHE ---
export const MATRICULAS_ALUNO_QUERY_KEY = ["matriculas", "aluno", "me"];

// --- FETCHER ---
async function getMatriculasAluno(): Promise<Resposta<Matricula[]>> {
  const response = await api.get<Resposta<Matricula[]>>(`/matriculas/me`);
  return response.data;
}

// --- HOOK ---
export function useMatriculasAluno() {
  return useQuery({
    queryKey: MATRICULAS_ALUNO_QUERY_KEY,
    queryFn: getMatriculasAluno,
  });
}
