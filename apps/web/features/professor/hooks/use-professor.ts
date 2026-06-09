"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Resposta,
  Aula,
  Evento,
  Matricula,
  ProfessorTurmaDetalhado,
  CreateEventoInput,
  UpdateEventoInput,
  RegistrarFrequenciaInput,
  RegistrarNotasInput,
} from "@repo/types";
import { toast } from "sonner";

// --- CHAVES DE CACHE ---
export const PROFESSOR_TURMAS_QUERY_KEY = ["professor", "turmas"];
export const PROFESSOR_AULAS_QUERY_KEY = ["professor", "aulas"];
export const PROFESSOR_EVENTOS_QUERY_KEY = ["professor", "eventos"];
export const PROFESSOR_MATRICULAS_QUERY_KEY = ["professor", "matriculas"];
export const PROFESSOR_ANOS_LETIVOS_QUERY_KEY = ["professor", "anos-letivos"];

// --- FETCHERS ---
async function getAnosLetivosProfessor(): Promise<Resposta<number[]>> {
  const response = await api.get<Resposta<number[]>>("/professor/anos-letivos");
  return response.data;
}

async function getTurmasProfessor(
  anoLetivo?: number,
): Promise<Resposta<ProfessorTurmaDetalhado[]>> {
  const response = await api.get<Resposta<ProfessorTurmaDetalhado[]>>(
    "/professor/turmas",
    { params: { anoLetivo } },
  );
  return response.data;
}

async function getAulasProfessor(
  turmaId?: number,
  disciplinaId?: number,
): Promise<Resposta<Aula[]>> {
  const response = await api.get<Resposta<Aula[]>>("/professor/aulas", {
    params: { turmaId, disciplinaId },
  });
  return response.data;
}

async function getMatriculasCursando(
  turmaId: number,
  disciplinaId?: number,
): Promise<Resposta<Matricula[]>> {
  const response = await api.get<Resposta<Matricula[]>>(
    `/professor/turmas/${turmaId}/matriculas`,
    { params: { disciplinaId } },
  );
  return response.data;
}

async function getEventosPendentes(
  anoLetivo?: number,
): Promise<Resposta<Evento[]>> {
  const response = await api.get<Resposta<Evento[]>>(
    "/professor/eventos/pendentes",
    { params: { anoLetivo } },
  );
  return response.data;
}

async function getProximosEventos(
  anoLetivo?: number,
): Promise<Resposta<Evento[]>> {
  const response = await api.get<Resposta<Evento[]>>(
    "/professor/eventos/proximos",
    { params: { anoLetivo } },
  );
  return response.data;
}

async function getEventosPorTurmaEDisciplina(
  turmaId: number,
  disciplinaId: number,
): Promise<Resposta<Evento[]>> {
  const response = await api.get<Resposta<Evento[]>>(
    `/professor/eventos/turma/${turmaId}/disciplina/${disciplinaId}`,
  );
  return response.data;
}

async function createEvento(
  dados: CreateEventoInput,
): Promise<Resposta<Evento>> {
  const response = await api.post<Resposta<Evento>>(
    "/professor/eventos",
    dados,
  );
  return response.data;
}

async function updateEvento({
  id,
  dados,
}: {
  id: number;
  dados: UpdateEventoInput;
}): Promise<Resposta<Evento>> {
  const response = await api.patch<Resposta<Evento>>(
    `/professor/eventos/${id}`,
    dados,
  );
  return response.data;
}

async function excluirEvento(id: number): Promise<Resposta<null>> {
  const response = await api.delete<Resposta<null>>(`/professor/eventos/${id}`);
  return response.data;
}

async function registrarFrequencia(
  dados: RegistrarFrequenciaInput,
): Promise<Resposta<Aula>> {
  const response = await api.post<Resposta<Aula>>(
    "/professor/frequencia",
    dados,
  );
  return response.data;
}

async function registrarNotas({
  eventoId,
  dados,
}: {
  eventoId: number;
  dados: RegistrarNotasInput;
}): Promise<Resposta<Evento>> {
  const response = await api.post<Resposta<Evento>>(
    `/professor/eventos/${eventoId}/notas`,
    dados,
  );
  return response.data;
}

async function resetarNotas(eventoId: number): Promise<Resposta<null>> {
  const response = await api.delete<Resposta<null>>(
    `/professor/eventos/${eventoId}/notas`,
  );
  return response.data;
}

async function getAulaById(id: number): Promise<Resposta<Aula>> {
  const response = await api.get<Resposta<Aula>>(`/professor/aulas/${id}`);
  return response.data;
}

// NOVO: Busca evento específico com as notas
async function getEventoById(id: number): Promise<Resposta<Evento>> {
  const response = await api.get<Resposta<Evento>>(`/professor/eventos/${id}`);
  return response.data;
}

// --- HOOKS DE QUERIES ---
export function useAnosLetivosProfessor() {
  return useQuery({
    queryKey: PROFESSOR_ANOS_LETIVOS_QUERY_KEY,
    queryFn: getAnosLetivosProfessor,
  });
}

export function useTurmasProfessor(anoLetivo?: number) {
  return useQuery({
    queryKey: [...PROFESSOR_TURMAS_QUERY_KEY, anoLetivo],
    queryFn: () => getTurmasProfessor(anoLetivo),
  });
}

export function useAulasProfessor(turmaId?: number, disciplinaId?: number) {
  return useQuery({
    queryKey: [...PROFESSOR_AULAS_QUERY_KEY, { turmaId, disciplinaId }],
    queryFn: () => getAulasProfessor(turmaId, disciplinaId),
  });
}

export function useMatriculasCursando(
  turmaId: number,
  options?: {
    disciplinaId?: number;
    enabled?: boolean;
  },
) {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: [
      ...PROFESSOR_MATRICULAS_QUERY_KEY,
      turmaId,
      options?.disciplinaId,
    ],
    queryFn: () => getMatriculasCursando(turmaId, options?.disciplinaId),
    enabled: !!turmaId && enabled,
  });
}

export function useEventosPendentes(anoLetivo?: number) {
  return useQuery({
    queryKey: [...PROFESSOR_EVENTOS_QUERY_KEY, "pendentes", anoLetivo],
    queryFn: () => getEventosPendentes(anoLetivo),
  });
}

export function useProximosEventos(anoLetivo?: number) {
  return useQuery({
    queryKey: [...PROFESSOR_EVENTOS_QUERY_KEY, "proximos", anoLetivo],
    queryFn: () => getProximosEventos(anoLetivo),
  });
}

export function useEventosPorTurmaEDisciplina(
  turmaId: number,
  disciplinaId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [
      ...PROFESSOR_EVENTOS_QUERY_KEY,
      "turma",
      turmaId,
      "disciplina",
      disciplinaId,
    ],
    queryFn: () => getEventosPorTurmaEDisciplina(turmaId, disciplinaId),
    enabled: !!turmaId && !!disciplinaId && enabled,
  });
}

// --- HOOKS DE MUTATIONS ---
export function useCreateEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvento,
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_EVENTOS_QUERY_KEY });
      toast.success(resposta.mensagem);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useUpdateEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvento,
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_EVENTOS_QUERY_KEY });
      toast.success(resposta.mensagem);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useExcluirEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: excluirEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_EVENTOS_QUERY_KEY });
      toast.success("Evento excluído com sucesso.");
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem ||
        "Ocorreu um erro ao excluir o evento.";
      toast.error(mensagem);
    },
  });
}

export function useRegistrarFrequencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarFrequencia,
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_AULAS_QUERY_KEY });
      toast.success(resposta.mensagem);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useRegistrarNotas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarNotas,
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_EVENTOS_QUERY_KEY });
      toast.success(resposta.mensagem);
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useResetarNotas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetarNotas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSOR_EVENTOS_QUERY_KEY });
      toast.success("Notas resetadas com sucesso.");
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro ao resetar as notas.";
      toast.error(mensagem);
    },
  });
}

export function useAula(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...PROFESSOR_AULAS_QUERY_KEY, id],
    queryFn: () => getAulaById(id),
    enabled: !!id && enabled,
  });
}

export function useEvento(id: number) {
  return useQuery({
    queryKey: [...PROFESSOR_EVENTOS_QUERY_KEY, id],
    queryFn: () => getEventoById(id),
    enabled: !!id,
  });
}
