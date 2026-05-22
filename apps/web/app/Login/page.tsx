"use client";

import React, { useState } from "react";
import styles from "./login.module.css";

type Perfil = "Aluno" | "Professor" | "Administrador";

export default function Login() {
  const [perfil, setPerfil] = useState<Perfil>("Aluno");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleEntrar = () => {
    console.log("Entrando...", { perfil, usuario, senha });
    // Redirecionar conforme o perfil
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

          {/* Seletor de perfil */}
          <div className={styles.perfilSelector}>
            {perfis.map((p) => (
              <button
                key={p}
                onClick={() => setPerfil(p)}
                className={`${styles.perfilButton} ${
                  perfil === p ? styles.perfilButtonActive : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Campo Usuário */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Usuário:</label>
            <input
              type="text"
              placeholder="Seu nome de usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={styles.input}
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
            />
          </div>

          {/* Divisor */}
          <hr className={styles.divider} />

          {/* Botão Entrar */}
          <button onClick={handleEntrar} className={styles.entrarButton}>
            Entrar
          </button>

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