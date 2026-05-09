"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./evento.module.css";

export default function CriarEvento() {
  const [turma, setTurma] = useState("Turma A | Geografia");
  const [titulo, setTitulo] = useState("");
  const [dataEvento, setDataEvento] = useState("2026-03-13");
  const [tipoEvento, setTipoEvento] = useState("Aula Extra");
  const [descricao, setDescricao] = useState("");
  const [valeNota, setValeNota] = useState(true);
  const [valorAtividade, setValorAtividade] = useState("");

  const handleSalvarEvento = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples (opcional)
    if (!titulo.trim()) {
      alert("Por favor, preencha o título do evento.");
      return;
    }

    console.log("Salvando evento...", {
      turma,
      titulo,
      dataEvento,
      tipoEvento,
      descricao,
      valeNota,
      valorAtividade,
    });

    alert("Evento criado com sucesso!");

    // Reseta todos os campos para o estado inicial
    setTitulo("");
    setDataEvento("2026-03-13");
    setTipoEvento("Aula Extra");
    setDescricao("");
    setValeNota(true);
    setValorAtividade("");
  };

  return (
    <div className={styles.container}>
      {/* HEADER / NAVBAR */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>C</div>
            <span className={styles.logoText}>Conecta Classe</span>
          </div>
          <nav className={styles.nav}>
            <Link href="#" className={styles.navLink}>Painel Geral</Link>
            <Link href="/professorChamada" className={styles.navLink}>Frequência</Link>
            <Link href="/professorEvento" className={styles.navLink}>Criar Evento</Link>
            <Link href="/professorGerenciar" className={styles.navLink}>Gerenciar Eventos</Link>
          </nav>
        </div>
        <button className={styles.exitButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.exitIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12l-3-3m0 0l-3 3m3-3H9"
            />
          </svg>
        </button>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        {/* Topo: Título e Seletor de Turma */}
        <div className={styles.topRow}>
          <h1 className={styles.title}>Criar Novo Evento</h1>

          {/* Card Turma */}
          <div className={styles.turmaCard}>
            <label className={styles.cardLabel}>Turma:</label>
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className={styles.select}
            >
              <option>Turma A | Geografia</option>
              <option>Turma B | História</option>
            </select>
          </div>
        </div>

        {/* Formulário de Criação de Evento */}
        <form onSubmit={handleSalvarEvento} className={styles.formCard}>
          {/* Linha 1: Título, Data, Tipo */}
          <div className={styles.rowThreeCols}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Título do Evento:</label>
              <input
                type="text"
                placeholder="Ex:Prova Bimestral"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className={styles.inputText}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Data Do Evento</label>
              <input
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
                className={styles.inputDate}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Tipo De Evento</label>
              <select
                value={tipoEvento}
                onChange={(e) => setTipoEvento(e.target.value)}
                className={styles.selectField}
              >
                <option>Aula Extra</option>
                <option>Prova</option>
                <option>Trabalho</option>
              </select>
            </div>
          </div>

          {/* Linha 2: Descrição */}
          <div className={`${styles.fieldGroup} mb-4`}>
            <label className={styles.fieldLabel}>Descrição / Instruções:</label>
            <textarea
              placeholder="Detalhes sobre o evento para os alunos..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={styles.textarea}
            />
          </div>

          {/* Linha 3: Checkbox Vale Nota e Valor Atividade */}
          <div className={styles.checkboxGroup} onClick={() => setValeNota(!valeNota)}>
            <input
              type="checkbox"
              checked={valeNota}
              readOnly
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>Vale nota</span>
          </div>

          {valeNota && (
            <div className={`${styles.fieldGroup} ${styles.notaSection}`}>
              <label className={styles.fieldLabel}>Valor Atividade</label>
              <input
                type="text"
                placeholder="Ex:5"
                value={valorAtividade}
                onChange={(e) => setValorAtividade(e.target.value)}
                className={styles.inputText}
              />
            </div>
          )}
        </form>

        {/* Botão Salvar Evento */}
        <div className={styles.saveWrapper}>
          <button onClick={handleSalvarEvento} className={styles.saveButton}>
            Salvar Evento
          </button>
        </div>
      </main>
    </div>
  );
}