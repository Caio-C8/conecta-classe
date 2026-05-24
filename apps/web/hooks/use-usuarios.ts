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
} from "@repo/types";

// --- CHAVES DE CACHE ---
// Centralizar as chaves evita erros de digitação ao invalidar o cache
export const USUARIOS_QUERY_KEY = ["usuarios"];

// --- FUNÇÕES DE API (FETCHERS) ---

async function getUsuarios(
  params: GetUsuariosInput,
): Promise<Resposta<Paginacao<UsuarioSemSenha>>> {
  // O axios converte o objeto params automaticamente para query strings na URL (?pagina=1&limite=10)
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

// --- HOOKS ---

/**
 * Hook para buscar a lista paginada de usuários.
 */
export function useUsuarios(params: GetUsuariosInput) {
  return useQuery({
    // A chave inclui os parâmetros. Se a página mudar, o React Query busca a nova página e faz cache separadamente
    queryKey: [...USUARIOS_QUERY_KEY, params],
    queryFn: () => getUsuarios(params),
  });
}

/**
 * Hook para criar um novo usuário.
 */
export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      // Força a lista de usuários a recarregar automaticamente para exibir o novo usuário
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

/**
 * Hook para atualizar os dados de um usuário existente.
 */
export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

/**
 * Hook para inativar (soft delete) um usuário.
 */
export function useInativarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inativarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}

/**
 * Hook para ativar um usuário que estava inativado.
 */
export function useAtivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ativarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_QUERY_KEY });
    },
  });
}
