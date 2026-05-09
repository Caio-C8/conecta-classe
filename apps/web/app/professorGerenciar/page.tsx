"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./gerenciar.module.css";

const initialEventos = [
  { id: 1, data: "20/03/2026", nome: "Avaliação Mensal: Geografia", turma: "8º Ano A", tipo: "Prova", finalizado: false },
  { id: 2, data: "25/03/2026", nome: "Seminário: Relevo Brasileiro", turma: "8º Ano A", tipo: "Atividade", finalizado: false },
  { id: 3, data: "28/03/2026", nome: "Palestra Ambiental", turma: "9º Ano B", tipo: "Geral", finalizado: true },
];

export default function GerenciarEventos() {
  const [eventos, setEventos] = useState(initialEventos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEvento, setEditEvento] = useState<any>(null);

  const abrirEdicao = (evento: any) => {
    setEditEvento({ ...evento });
    setIsModalOpen(true);
  };

  const salvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();
    setEventos(eventos.map(ev => ev.id === editEvento.id ? editEvento : ev));
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
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
            <Link href="/professorGerenciar" className={`${styles.navLink} ${styles.navLinkActive}`}>Gerenciar Eventos</Link>
          </nav>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
        </button>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Gerenciar Eventos</h1>
          <Link href="/professorEvento" className={styles.newButton}>
            <span style={{ fontSize: '20px' }}>+</span> Novo evento
          </Link>
        </div>

        {/* FILTROS */}
        <div className={styles.filtersCard}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Pesquisar</label>
            <input type="text" placeholder="Nome do evento.." className={styles.filterInput} />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Turma</label>
            <select className={styles.filterSelect}><option>Todas as Turmas</option></select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tipo</label>
            <select className={styles.filterSelect}><option>Todos</option></select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Evento finalizado</label>
            <select className={styles.filterSelect}><option>Não</option></select>
          </div>
        </div>

        {/* TABELA */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Data</th>
                <th className={styles.th} style={{ textAlign: 'left' }}>Evento</th>
                <th className={styles.th}>Turma</th>
                <th className={styles.th}>Tipo</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td className={styles.td}>{evento.data}</td>
                  <td className={styles.td} style={{ textAlign: 'left' }}>{evento.nome}</td>
                  <td className={styles.td}>{evento.turma}</td>
                  <td className={styles.td}>{evento.tipo}</td>
                  <td className={styles.td}>
                    <div className={styles.actionGroup}>
                      <button className={styles.editButton} onClick={() => abrirEdicao(evento)}>Editar</button>
                      <Link href="/professorNotas"><button className={styles.actionButton}>Lançar Notas</button></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE EDIÇÃO */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            {/* Cabeçalho do Modal */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar evento</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>&times;</button>
            </div>

            <form onSubmit={salvarAlteracoes} className={styles.modalForm}>
              
              {/* Nome */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Nome do Evento:</label>
                <input 
                  type="text"
                  className={styles.filterInput} 
                  value={editEvento.nome} 
                  onChange={(e) => setEditEvento({...editEvento, nome: e.target.value})}
                />
              </div>

              {/* Data e Tipo */}
              <div className={styles.rowInputs}>
                <div className={styles.filterGroup} style={{ flex: 1 }}>
                  <label className={styles.filterLabel}>Data:</label>
                  <input 
                    type="text"
                    className={styles.filterInput} 
                    value={editEvento.data} 
                    onChange={(e) => setEditEvento({...editEvento, data: e.target.value})}
                  />
                </div>
                <div className={styles.filterGroup} style={{ flex: 1 }}>
                  <label className={styles.filterLabel}>Tipo:</label>
                  <select 
                    className={styles.filterSelect}
                    value={editEvento.tipo}
                    onChange={(e) => setEditEvento({...editEvento, tipo: e.target.value})}
                  >
                    <option value="Prova">Prova</option>
                    <option value="Atividade">Atividade</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              {/* Turma */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Turma:</label>
                <select 
                  className={styles.filterSelect}
                  value={editEvento.turma}
                  onChange={(e) => setEditEvento({...editEvento, turma: e.target.value})}
                >
                  <option value="8º Ano A">8º Ano A</option>
                  <option value="9º Ano B">9º Ano B</option>
                </select>
              </div>

              {/* Rodapé com os 2 botões alinhados à direita */}
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.btnCancelar}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSalvar}>
                  Salvar alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}