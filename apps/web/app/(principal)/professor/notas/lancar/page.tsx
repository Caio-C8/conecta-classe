"use client";

import { useState } from "react";
import styles from "./notas.module.css";

// Dados mockados iniciais baseados na imagem
const initialAlunos = [
  { id: "001", nome: "Aluno 1", status: "Lançada", nota: "3.0" },
  { id: "002", nome: "Aluno 2", status: "Lançada", nota: "10.0" },
  { id: "003", nome: "Aluno 3", status: "Pendente", nota: "0.0" },
];

export default function LancarNotas() {
  const [turma, setTurma] = useState("Turma A | Geografia");
  const [alunos, setAlunos] = useState(initialAlunos);

  const handleNotaChange = (id: string, value: string) => {
    setAlunos((prevAlunos) =>
      prevAlunos.map((aluno) => {
        if (aluno.id === id) {
          // Se o professor colocar uma nota válida maior que 0, altera o status para Lançada.
          const novaNota = parseFloat(value.replace(",", "."));
          const novoStatus = novaNota > 0 ? "Lançada" : "Pendente";
          return { ...aluno, nota: value, status: novoStatus };
        }
        return aluno;
      }),
    );
  };

  const handleSalvarNotas = () => {
    console.log("Notas salvas:", { turma, alunos });
    alert("Notas salvas com sucesso!");
  };

  return (
    <div className={styles.container}>
      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        {/* Topo: Título e Seletor de Turma */}
        <div className={styles.topRow}>
          <div>
            <span className={styles.subHeaderLabel}>Lançar Notas</span>
            <h1 className={styles.title}>
              Avaliação Mensal: Geografia do Brasil
            </h1>
          </div>

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

        {/* Card de Informações do Evento */}
        <div className={styles.infoCard}>
          <div className={styles.infoGroup}>
            <label className={styles.infoLabel}>Data</label>
            <div className={styles.infoDisplay}>20/03/2026</div>
          </div>

          <div className={styles.infoGroup}>
            <label className={styles.infoLabel}>Valor Máximo</label>
            <div className={styles.infoDisplay}>10,0</div>
          </div>

          <div className={styles.infoGroup}>
            <label className={styles.infoLabel}>Tipo</label>
            <div className={styles.infoDisplay}>Prova</div>
          </div>
        </div>

        {/* Tabela de Lançamento de Notas */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={styles.th}
                  style={{ textAlign: "center", width: "150px" }}
                >
                  Identificação
                </th>
                <th className={styles.th}>Nome do Aluno</th>
                <th
                  className={styles.th}
                  style={{ textAlign: "center", width: "180px" }}
                >
                  Status
                </th>
                <th
                  className={styles.th}
                  style={{ textAlign: "center", width: "180px" }}
                >
                  Nota Final
                </th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    {aluno.id}
                  </td>
                  <td className={styles.td}>{aluno.nome}</td>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    <span
                      className={`${styles.statusTag} ${
                        aluno.status === "Lançada"
                          ? styles.statusLancada
                          : styles.statusPendente
                      }`}
                    >
                      {aluno.status}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={aluno.nota}
                      onChange={(e) =>
                        handleNotaChange(aluno.id, e.target.value)
                      }
                      className={styles.notaInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botão Salvar */}
        <div className={styles.saveWrapper}>
          <button onClick={handleSalvarNotas} className={styles.saveButton}>
            Salvar Notas
          </button>
        </div>
      </main>
    </div>
  );
}
