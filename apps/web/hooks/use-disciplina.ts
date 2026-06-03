"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Resposta,
  Paginacao,
  Disciplina,
  CreateDisciplinaInput,
  UpdateDisciplinaInput,
  GetDisciplinasInput,
} from "@repo/types";

// --- CHAVES DE CACHE ---
export const DISCIPLINAS_QUERY_KEY = ["disciplinas"];
export const RESUMO_DISCIPLINAS_QUERY_KEY = ["disciplinas", "resumo"];

// --- FETCHERS ---
async function getDisciplinas(
  params: GetDisciplinasInput,
): Promise<Resposta<Paginacao<Disciplina>>> {
  const response = await api.get<Resposta<Paginacao<Disciplina>>>(
    "/disciplinas",
    {
      params,
    },
  );
  return response.data;
}

async function createDisciplina(
  dados: CreateDisciplinaInput,
): Promise<Resposta<Disciplina>> {
  const response = await api.post<Resposta<Disciplina>>("/disciplinas", dados);
  return response.data;
}

async function updateDisciplina({
  id,
  dados,
}: {
  id: number;
  dados: UpdateDisciplinaInput;
}): Promise<Resposta<Disciplina>> {
  const response = await api.patch<Resposta<Disciplina>>(
    `/disciplinas/${id}`,
    dados,
  );
  return response.data;
}

async function inativarDisciplina(id: number): Promise<Resposta<Disciplina>> {
  const response = await api.patch<Resposta<Disciplina>>(
    `/disciplinas/${id}/inativar`,
  );
  return response.data;
}

async function ativarDisciplina(id: number): Promise<Resposta<Disciplina>> {
  const response = await api.patch<Resposta<Disciplina>>(
    `/disciplinas/${id}/ativar`,
  );
  return response.data;
}

async function getResumoDisciplinas(): Promise<
  Resposta<{ quantidade: number }>
> {
  const response = await api.get<Resposta<{ quantidade: number }>>(
    "/disciplinas/resumo",
  );
  return response.data;
}

// --- HOOKS ---
export function useDisciplinas(params: GetDisciplinasInput) {
  return useQuery({
    queryKey: [...DISCIPLINAS_QUERY_KEY, params],
    queryFn: () => getDisciplinas(params),
  });
}

export function useResumoDisciplinas() {
  return useQuery({
    queryKey: RESUMO_DISCIPLINAS_QUERY_KEY,
    queryFn: getResumoDisciplinas,
  });
}

export function useCreateDisciplina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCIPLINAS_QUERY_KEY });
    },
  });
}

export function useUpdateDisciplina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCIPLINAS_QUERY_KEY });
    },
  });
}

export function useInativarDisciplina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inativarDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCIPLINAS_QUERY_KEY });
    },
  });
}

export function useAtivarDisciplina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ativarDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCIPLINAS_QUERY_KEY });
    },
  });
}
