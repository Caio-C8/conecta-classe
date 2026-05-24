"use client";

import { useState } from "react";
import styles from "./chamada.module.css";

const initialAlunos = [
  { id: 1, nome: "Aluno 1", faltas: 0 },
  { id: 2, nome: "Aluno 2", faltas: 1 },
  { id: 3, nome: "Aluno 3", faltas: 2 },
];

export default function LancarFrequencia() {
  const [dataAula, setDataAula] = useState("2026-03-13");
  const [turma, setTurma] = useState("Turma A | Geografia");
  const [alunos, setAlunos] = useState(initialAlunos);

  const incrementarFalta = (id: number) => {
    setAlunos((prevAlunos) =>
      prevAlunos.map((aluno) =>
        aluno.id === id ? { ...aluno, faltas: aluno.faltas + 1 } : aluno,
      ),
    );
  };

  const decrementarFalta = (id: number) => {
    setAlunos((prevAlunos) =>
      prevAlunos.map((aluno) =>
        aluno.id === id && aluno.faltas > 0
          ? { ...aluno, faltas: aluno.faltas - 1 }
          : aluno,
      ),
    );
  };

  const handleSalvar = () => {
    console.log("Salvando frequência...", { dataAula, turma, alunos });
    alert("Frequência salva com sucesso!");
  };

  return (
    <div className={styles.container}>
      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        {/* Topo: Título e Seletor de Turma */}
        <div className={styles.topRow}>
          <h1 className={styles.title}>Lançar Frequência</h1>

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

        {/* Card Data da Aula */}
        <div className={styles.dataCard}>
          <div className={styles.dateInputWrapper}>
            <label className={styles.inputLabel}>Data da Aula:</label>
            <input
              type="date"
              value={dataAula}
              onChange={(e) => setDataAula(e.target.value)}
              className={styles.inputDate}
            />
          </div>
        </div>

        {/* Card Central / Tabela de Alunos */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome do Aluno</th>
                <th className={styles.th}>Quantidade de Faltas</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td className={styles.td}>{aluno.nome}</td>
                  <td className={styles.td}>
                    <div className={styles.counterWrapper}>
                      <button
                        onClick={() => decrementarFalta(aluno.id)}
                        className={styles.counterButton}
                      >
                        -
                      </button>
                      <span className={styles.counterValue}>
                        {aluno.faltas}
                      </span>
                      <button
                        onClick={() => incrementarFalta(aluno.id)}
                        className={styles.counterButton}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botão Salvar */}
        <div className={styles.saveWrapper}>
          <button onClick={handleSalvar} className={styles.saveButton}>
            Salvar Frequência
          </button>
        </div>
      </main>
    </div>
  );
}
