"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { useLogin } from "@/hooks/use-autenticacao"; // Ajuste o caminho conforme a sua pasta de hooks

type Perfil = "Aluno" | "Professor" | "Administrador";

export default function Login() {
  const [perfil, setPerfil] = useState<Perfil>("Aluno");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  // Injeção do hook de autenticação com React Query + Axios
  const { mutate, isPending, error, isError } = useLogin();

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault(); // Evita o recarregamento nativo da página

    if (!usuario || !senha) return;

    // Dispara a requisição de login para o backend
    mutate({ usuario, senha });
  };

  // Função utilitária para capturar a mensagem de erro da sua instância do Axios
  const getErrorMessage = (error: any) => {
    if (error.response?.data?.mensagem) {
      return error.response.data.mensagem;
    }
    return error.message || "Erro inesperado ao realizar o login.";
  };

  const perfis: Perfil[] = ["Aluno", "Professor", "Administrador"];

  return (
    <div className={styles.pageWrapper}>
      {/* Área cinza central */}
      <div className={styles.background}>
        {/* Card de login */}
        <div className={styles.card}>
          <h1 className={styles.title}>Acesse sua conta</h1>
          <p className={styles.subtitle}>
            Seleciona seu perfil e insira as credenciais
            <br />
            para continuar
          </p>

          {/* Seletor de perfil (Mantido para preservar seu design visual) */}
          <div className={styles.perfilSelector}>
            {perfis.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPerfil(p)}
                className={`${styles.perfilButton} ${
                  perfil === p ? styles.perfilButtonActive : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Formulário unificado */}
          <form onSubmit={handleEntrar} style={{ width: "100%" }}>
            {/* Bloco visual para exibir mensagens de erro do backend */}
            {isError && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#DC2626",
                  borderRadius: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                {getErrorMessage(error)}
              </div>
            )}

            {/* Campo Usuário */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Usuário:</label>
              <input
                type="text"
                placeholder="Seu nome de usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha:</label>
              <input
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Divisor */}
            <hr className={styles.divider} />

            {/* Botão Entrar com estado de carregamento controlado */}
            <button
              type="submit"
              disabled={isPending}
              className={styles.entrarButton}
              style={{
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          {/* Rodapé do card */}
          <hr className={styles.divider} />
          <p className={styles.footerText}>
            Caso seja seu primeiro acesso ou tenha esquecido sua senha, entre em
            contato com a direção.
          </p>
        </div>
      </div>
    </div>
  );
}
