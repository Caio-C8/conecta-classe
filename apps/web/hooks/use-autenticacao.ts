"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { RespostaLogin, Resposta, TrocarSenhaInput } from "@repo/types";

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

      console.log("=== DEBUG RESPOSTA LOGIN ===");
      console.dir(resposta, { depth: null });
      console.log("----------------------------");

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

      if (usuario.trocar_senha) {
        router.push("/trocar-senha");
      } else {
        redirecionarParaPainel(usuario.papel, router);
      }

      router.refresh();
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

      redirecionarParaPainel(usuario.papel, router);

      router.refresh();
    },
  });
}
