"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { useLogin } from "@/hooks/use-autenticacao";
import { Papel } from "@repo/types";

export default function Login() {
  const [papel, setPapel] = useState<Papel>(Papel.ALUNO);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const { mutate, isPending, error, isError } = useLogin();

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !senha) return;

    mutate({ usuario, senha, papel });
  };

  const getErrorMessage = (error: any) => {
    if (error.response?.data?.mensagem) {
      return error.response.data.mensagem;
    }
    return error.message || "Erro inesperado ao realizar o login.";
  };

  const papeis: Papel[] = [Papel.ALUNO, Papel.PROFESSOR, Papel.ADMINISTRADOR];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}>
        <div className={styles.card}>
          <h1 className={styles.title}>Acesse sua conta</h1>
          <p className={styles.subtitle}>
            Seleciona seu perfil e insira as credenciais
            <br />
            para continuar
          </p>

          <div className={styles.perfilSelector}>
            {papeis.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPapel(p)}
                className={`${styles.perfilButton} ${
                  papel === p ? styles.perfilButtonActive : ""
                }`}
              >
                {p.toLowerCase().charAt(0).toUpperCase() +
                  p.toLowerCase().slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleEntrar} style={{ width: "100%" }}>
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

            <hr className={styles.divider} />

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
