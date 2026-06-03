"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Resposta,
  Paginacao,
  Turma,
  CreateTurmaInput,
  UpdateTurmaInput,
  GetTurmasInput,
  VincularEDesvincularProfessorInput,
  VincularEDesvincularAlunoInput,
  ResumoTurmas,
} from "@repo/types";

// --- CHAVES DE CACHE ---
export const TURMAS_QUERY_KEY = ["turmas"];
export const RESUMO_TURMAS_QUERY_KEY = ["turmas", "resumo"];

// --- FETCHERS ---
async function getTurmas(
  params: GetTurmasInput,
): Promise<Resposta<Paginacao<Turma>>> {
  const response = await api.get<Resposta<Paginacao<Turma>>>("/turmas", {
    params,
  });
  return response.data;
}

async function getTurmaById(id: number): Promise<Resposta<Turma>> {
  const response = await api.get<Resposta<Turma>>(`/turmas/${id}`);
  return response.data;
}

async function createTurma(dados: CreateTurmaInput): Promise<Resposta<Turma>> {
  const response = await api.post<Resposta<Turma>>("/turmas", dados);
  return response.data;
}

async function updateTurma({
  id,
  dados,
}: {
  id: number;
  dados: UpdateTurmaInput;
}): Promise<Resposta<Turma>> {
  const response = await api.patch<Resposta<Turma>>(`/turmas/${id}`, dados);
  return response.data;
}

async function inativarTurma(id: number): Promise<Resposta<Turma>> {
  const response = await api.patch<Resposta<Turma>>(`/turmas/${id}/inativar`);
  return response.data;
}

async function ativarTurma(id: number): Promise<Resposta<Turma>> {
  const response = await api.patch<Resposta<Turma>>(`/turmas/${id}/ativar`);
  return response.data;
}

async function encerrarTurma(id: number): Promise<Resposta<Turma>> {
  const response = await api.patch<Resposta<Turma>>(`/turmas/${id}/encerrar`);
  return response.data;
}

async function retomarTurma(id: number): Promise<Resposta<Turma>> {
  const response = await api.patch<Resposta<Turma>>(`/turmas/${id}/retomar`);
  return response.data;
}

async function vincularProfessor({
  id,
  dados,
}: {
  id: number;
  dados: VincularEDesvincularProfessorInput;
}): Promise<Resposta<Turma>> {
  const response = await api.post<Resposta<Turma>>(
    `/turmas/${id}/vincular/professor`,
    dados,
  );
  return response.data;
}

async function desvincularProfessor({
  id,
  dados,
}: {
  id: number;
  dados: VincularEDesvincularProfessorInput;
}): Promise<Resposta<null>> {
  const response = await api.delete<Resposta<null>>(
    `/turmas/${id}/desvincular/professor`,
    {
      data: dados,
    },
  );
  return response.data;
}

async function vincularAluno({
  id,
  dados,
}: {
  id: number;
  dados: VincularEDesvincularAlunoInput;
}): Promise<Resposta<Turma>> {
  const response = await api.post<Resposta<Turma>>(
    `/turmas/${id}/vincular/aluno`,
    dados,
  );
  return response.data;
}

async function desvincularAluno({
  id,
  dados,
}: {
  id: number;
  dados: VincularEDesvincularAlunoInput;
}): Promise<Resposta<null>> {
  const response = await api.patch<Resposta<null>>(
    `/turmas/${id}/desvincular/aluno`,
    dados,
  );
  return response.data;
}

async function getResumoTurmas(): Promise<Resposta<ResumoTurmas>> {
  const response = await api.get<Resposta<ResumoTurmas>>("/turmas/resumo");
  return response.data;
}

// --- HOOKS ---
export function useTurmas(params: GetTurmasInput) {
  return useQuery({
    queryKey: [...TURMAS_QUERY_KEY, params],
    queryFn: () => getTurmas(params),
  });
}

export function useTurma(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...TURMAS_QUERY_KEY, id],
    queryFn: () => getTurmaById(id),
    enabled: !!id && enabled,
  });
}

export function useResumoTurmas() {
  return useQuery({
    queryKey: RESUMO_TURMAS_QUERY_KEY,
    queryFn: getResumoTurmas,
  });
}

export function useCreateTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useUpdateTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useInativarTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inativarTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useAtivarTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ativarTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useEncerrarTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: encerrarTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useRetomarTurma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retomarTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useVincularProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vincularProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useDesvincularProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desvincularProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useVincularAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vincularAluno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}

export function useDesvincularAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desvincularAluno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TURMAS_QUERY_KEY });
    },
  });
}
