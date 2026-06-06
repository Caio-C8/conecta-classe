"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Resposta, Evento, TipoEvento } from "@repo/types";
import { toast } from "sonner";

// --- TIPAGENS DE RETORNO ---
export interface ResumoTurmaProfessor {
  idTurma: number;
  nomeTurma: string;
  materia: string;
  numeroAlunos: number;
}

export interface DiarioDeNotas {
  evento: {
    id: number;
    titulo: string;
    nota_maxima: number;
  };
  alunos: {
    matricula_id: number;
    nome_aluno: string;
    nota_obtida: number | null;
  }[];
}

export interface AlunoChamada {
  id: number;
  nome: string;
  faltas: number;
}

export interface CreateEventoInput {
  titulo: string;
  descricao?: string;
  data_evento: string | Date;
  valor_nota?: number;
  tipo_evento: TipoEvento;
  turma_id: number;
  disciplina_id: number;
}

// --- CHAVES DE CACHE ---
export const PROFESSOR_TURMAS_QUERY_KEY = ["professor", "turmas"];
export const PROFESSOR_PROXIMOS_EVENTOS_QUERY_KEY = [
  "professor",
  "eventos",
  "proximos",
];
export const PROFESSOR_DIARIO_NOTAS_QUERY_KEY = [
  "professor",
  "diario",
  "notas",
];
export const PROFESSOR_ALUNOS_CHAMADA_QUERY_KEY = [
  "professor",
  "alunos",
  "chamada",
];

// --- FETCHERS ---
async function getTurmasProfessor(): Promise<Resposta<ResumoTurmaProfessor[]>> {
  const response =
    await api.get<Resposta<ResumoTurmaProfessor[]>>("/professor/turmas");
  return response.data;
}

async function getProximosEventosProfessor(): Promise<Resposta<Evento[]>> {
  const response = await api.get<Resposta<Evento[]>>(
    "/professor/eventos/proximos",
  );
  return response.data;
}

async function getDiarioDeNotas(
  eventoId: number,
): Promise<Resposta<DiarioDeNotas>> {
  const response = await api.get<Resposta<DiarioDeNotas>>(
    `/professor/eventos/${eventoId}/notas`,
  );
  return response.data;
}

async function getAlunosParaChamada(
  turmaId: number,
  aulaId?: number,
): Promise<Resposta<AlunoChamada[]>> {
  const url = aulaId
    ? `/professor/turmas/${turmaId}/alunos?aula_id=${aulaId}`
    : `/professor/turmas/${turmaId}/alunos`;

  const response = await api.get<Resposta<AlunoChamada[]>>(url);
  return response.data;
}

async function criarEvento(
  dados: CreateEventoInput,
): Promise<Resposta<Evento>> {
  const response = await api.post<Resposta<Evento>>(
    "/professor/eventos",
    dados,
  );
  return response.data;
}

// --- HOOKS ---
export function useTurmasProfessor() {
  return useQuery({
    queryKey: PROFESSOR_TURMAS_QUERY_KEY,
    queryFn: getTurmasProfessor,
  });
}

export function useProximosEventosProfessor() {
  return useQuery({
    queryKey: PROFESSOR_PROXIMOS_EVENTOS_QUERY_KEY,
    queryFn: getProximosEventosProfessor,
  });
}

export function useDiarioNotasProfessor(
  eventoId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...PROFESSOR_DIARIO_NOTAS_QUERY_KEY, eventoId],
    queryFn: () => getDiarioDeNotas(eventoId),
    enabled: !!eventoId && enabled,
  });
}

export function useAlunosChamadaProfessor(
  turmaId: number,
  aulaId?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...PROFESSOR_ALUNOS_CHAMADA_QUERY_KEY, turmaId, aulaId],
    queryFn: () => getAlunosParaChamada(turmaId, aulaId),
    enabled: !!turmaId && enabled,
  });
}

export function useCriarEventoProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarEvento,
    onSuccess: (resposta) => {
      queryClient.invalidateQueries({
        queryKey: PROFESSOR_PROXIMOS_EVENTOS_QUERY_KEY,
      });
      toast.success(resposta.mensagem || "Evento criado com sucesso!");
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro ao criar o evento.";
      toast.error(mensagem);
    },
  });
}
