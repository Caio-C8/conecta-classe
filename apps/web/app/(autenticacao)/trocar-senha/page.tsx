"use client";

import React, { useState } from "react";
import styles from "./trocar-senha.module.css";
import { useTrocarSenha } from "@/hooks/use-autenticacao";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, error, isError } = useTrocarSenha();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) return;

    if (novaSenha !== confirmarSenha) {
      setValidationError("A nova senha e a confirmação não coincidem.");
      return;
    }

    mutate({ senha_atual: senhaAtual, nova_senha: novaSenha, confirmar_senha: confirmarSenha });
  };

  const getErrorMessage = (error: any) => {
    if (error?.response?.data?.mensagem) {
      return error.response.data.mensagem;
    }
    return error?.message || "Erro inesperado ao alterar a senha.";
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}>
        <div className={styles.card}>
          <h1 className={styles.title}>Altere sua senha</h1>
          <p className={styles.subtitle}>
            Preencha os campos com sua nova senha
            <br />
            para ela ser alterada
          </p>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {(validationError || isError) && (
              <div className={styles.errorBox}>
                {validationError ?? getErrorMessage(error)}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha atual:</label>
              <input
                type="password"
                placeholder="Sua senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nova senha:</label>
              <input
                type="password"
                placeholder="Sua nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmar senha:</label>
              <input
                type="password"
                placeholder="Digite novamente sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <hr className={styles.divider} />

            <button
              type="submit"
              disabled={isPending}
              className={styles.submitButton}
              style={{
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Alterando..." : "Alterar senha e Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}