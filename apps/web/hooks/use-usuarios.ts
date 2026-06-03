"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Resposta,
  Paginacao,
  UsuarioSemSenha,
  CreateUsuarioInput,
  UpdateUsuarioInput,
  GetUsuariosInput,
  ResumoProfessores,
  ResumoAlunos,
} from "@repo/types";

// --- CHAVES DE CACHE ---
export const USUARIOS_QUERY_KEY = ["usuarios"];
export const RESUMO_ALUNOS_QUERY_KEY = ["usuarios", "resumo", "alunos"];
export const RESUMO_PROFESSORES_QUERY_KEY = [
  "usuarios",
  "resumo",
  "professores",
];

// --- FETCHERS ---
async function getUsuarios(
  params: GetUsuariosInput,
): Promise<Resposta<Paginacao<UsuarioSemSenha>>> {
  const response = await api.get<Resposta<Paginacao<UsuarioSemSenha>>>(
    "/usuarios",
    {
      params,
    },
  );
  return response.data;
}

async function createUsuario(
  dados: CreateUsuarioInput,
): Promise<Resposta<UsuarioSemSenha>> {
  const response = await api.post<Resposta<UsuarioSemSenha>>(
    "/usuarios",
    dados,
  );
  return response.data;
}

async function updateUsuario({
  id,
  dados,
}: {
  id: number;
  dados: UpdateUsuarioInput;
}): Promise<Resposta<UsuarioSemSenha>> {
  const response = await api.patch<Resposta<UsuarioSemSenha>>(
    `/usuarios/${id}`,
    dados,
  );
  return response.data;
}

async function inativarUsuario(id: number): Promise<Resposta<UsuarioSemSenha>> {
  const response = await api.patch<Resposta<UsuarioSemSenha>>(
    `/usuarios/${id}/inativar`,
  );
  return response.data;
}

async function ativarUsuario(id: number): Promise<Resposta<UsuarioSemSenha>> {
  const response = await api.patch<Resposta<UsuarioSemSenha>>(
    `/usuarios/${id}/ativar`,
  );
  return response.data;
}

async function getResumoAlunos(): Promise<Resposta<ResumoAlunos>> {
  const response = await api.get<Resposta<ResumoAlunos>>(
    "/usuarios/resumo/alunos",
  );
  return response.data;
}

async function getResumoProfessores(): Promise<Resposta<ResumoProfessores>> {
  const response = await api.get<Resposta<ResumoProfessores>>(
    "/usuarios/resumo/professores",
  );
  return response.data;
}

// --- HOOKS ---

export function useUsuarios(params: GetUsuariosInput) {
  return useQuery({
    queryKey: [...USUARIOS_QUERY_KEY, params],
    queryFn: () => getUsuarios(params),
  });
}

export function useResumoAlunos() {
  return useQuery({
    queryKey: RESUMO_ALUNOS_QUERY_KEY,
    queryFn: getResumoAlunos,
  });
}

export function useResumoProfessores() {
  return useQuery({
    queryKey: RESUMO_PROFESSORES_QUERY_KEY,
    queryFn: getResumoProfessores,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

export function useInativarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inativarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

export function useAtivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ativarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}
