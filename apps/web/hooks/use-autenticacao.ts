"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { RespostaLogin, Resposta, TrocarSenhaInput } from "@repo/types";
import { toast } from "sonner"; // <-- Importação do Sonner

async function loginRequest(
  credenciais: Record<string, string>,
): Promise<Resposta<RespostaLogin>> {
  const response = await api.post<Resposta<RespostaLogin>>(
    "/autenticacao/login",
    credenciais,
  );
  return response.data;
}

async function trocarSenhaRequest(
  dados: TrocarSenhaInput,
): Promise<Resposta<RespostaLogin>> {
  const response = await api.patch<Resposta<RespostaLogin>>(
    "/autenticacao/trocar/senha",
    dados,
  );
  return response.data;
}

function redirecionarParaPainel(papel: string, router: any) {
  const rotasPorPapel = {
    ADMINISTRADOR: "/admin",
    PROFESSOR: "/professor",
    ALUNO: "/aluno",
  };
  const destino =
    rotasPorPapel[papel as keyof typeof rotasPorPapel] || "/login";
  router.push(destino);
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (resposta) => {
      const { token, usuario } = resposta.dados;

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("papel", usuario.papel, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("trocar_senha", String(usuario.trocar_senha), {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });

      toast.success(resposta.mensagem);

      if (usuario.trocar_senha) {
        router.push("/trocar-senha");
      } else {
        redirecionarParaPainel(usuario.papel, router);
      }

      router.refresh();
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useTrocarSenha() {
  const router = useRouter();

  return useMutation({
    mutationFn: trocarSenhaRequest,
    onSuccess: (resposta) => {
      const { token, usuario } = resposta.dados;

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("papel", usuario.papel, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("trocar_senha", String(usuario.trocar_senha), {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });

      toast.success(resposta.mensagem);

      redirecionarParaPainel(usuario.papel, router);

      router.refresh();
    },
    onError: (error: any) => {
      const mensagem =
        error.response?.data?.mensagem || "Ocorreu um erro inesperado.";
      toast.error(mensagem);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("papel", { path: "/" });
    Cookies.remove("trocar_senha", { path: "/" });

    queryClient.clear();

    toast.info("Sessão encerrada com sucesso.");

    router.push("/login");
    router.refresh();
  };

  return logout;
}
