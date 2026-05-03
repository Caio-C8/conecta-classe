"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./gerenciar.module.css";

const initialEventos = [
  {
    id: 1,
    data: "20/03/2026",
    nome: "Avaliação Mensal: Geografia",
    turma: "8º Ano A",
    tipo: "Prova",
    finalizado: false,
  },
  {
    id: 2,
    data: "25/03/2026",
    nome: "Seminário: Relevo Brasileiro",
    turma: "8º Ano A",
    tipo: "Atividade",
    finalizado: false,
  },
  {
    id: 3,
    data: "28/03/2026",
    nome: "Palestra Ambiental",
    turma: "9º Ano B",
    tipo: "Geral",
    finalizado: true,
  },
];

export default function GerenciarEventos() {
  const [pesquisa, setPesquisa] = useState("");
  const [turma, setTurma] = useState("Todas as Turmas");
  const [tipo, setTipo] = useState("Todos");
  const [finalizado, setFinalizado] = useState("Não");

  // Filtragem dos eventos conforme os selects da imagem
  const eventosFiltrados = initialEventos.filter((evento) => {
    const batePesquisa = evento.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const bateTurma = turma === "Todas as Turmas" || evento.turma === turma;
    const bateTipo = tipo === "Todos" || evento.tipo === tipo;
    const statusFiltro = finalizado === "Sim" ? true : false;
    const bateStatus = evento.finalizado === statusFiltro;

    return batePesquisa && bateTurma && bateTipo && bateStatus;
  });

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
            <a href="#" className={styles.navLink}>Painel Geral</a>
            <a href="#" className={styles.navLink}>Frequência</a>
            <a href="#" className={styles.navLink}>Criar Evento</a>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Gerenciar Eventos</a>
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
        {/* Topo: Título e Botão */}
        <div className={styles.topRow}>
          <h1 className={styles.title}>Gerenciar Eventos</h1>
          <Link href="/professorEvento" className={styles.newButton}>
            <span>+</span> Novo evento
          </Link>
        </div>

        {/* Card de Filtros */}
        <div className={styles.filtersCard}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Pesquisar</label>
            <input
              type="text"
              placeholder="Nome do evento.."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Turma</label>
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className={styles.filterSelect}
            >
              <option>Todas as Turmas</option>
              <option>8º Ano A</option>
              <option>9º Ano B</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={styles.filterSelect}
            >
              <option>Todos</option>
              <option>Prova</option>
              <option>Atividade</option>
              <option>Geral</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Evento finalizado</label>
            <select
              value={finalizado}
              onChange={(e) => setFinalizado(e.target.value)}
              className={styles.filterSelect}
            >
              <option>Não</option>
              <option>Sim</option>
            </select>
          </div>
        </div>

        {/* Tabela de Eventos */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ textAlign: "center" }}>Data</th>
                <th className={styles.th}>Evento</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Turma</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Tipo</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id}>
                  <td className={styles.td} style={{ textAlign: "center" }}>{evento.data}</td>
                  <td className={styles.td}>{evento.nome}</td>
                  <td className={styles.td} style={{ textAlign: "center" }}>{evento.turma}</td>
                  <td className={styles.td} style={{ textAlign: "center" }}>{evento.tipo}</td>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    <div className={styles.actionGroup} style={{ justifyContent: "center" }}>
                      <button className={styles.editButton}>
                        {evento.finalizado ? "Falta" : "Editar"}
                      </button>
                      <button className={styles.actionButton}>Lançar Notas</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}