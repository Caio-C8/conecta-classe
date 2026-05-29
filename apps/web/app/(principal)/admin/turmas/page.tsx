"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, X, ChevronDown } from "lucide-react";

interface Turma {
  id: number;
  identificacao: string;
  serie: string;
  nivel: string;
  sala: string;
  status: "Ativo" | "Inativo";
  ano: string;
  situacao: "Em andamento" | "Encerrada";
}

export default function AdminTurmasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turmas] = useState<Turma[]>([
    {
      id: 1,
      identificacao: "Turma A",
      serie: "2º ano",
      nivel: "Fundamental I",
      sala: "202",
      status: "Ativo",
      ano: "2024",
      situacao: "Encerrada",
    },
    {
      id: 2,
      identificacao: "Turma B",
      serie: "9º ano",
      nivel: "Fundamental II",
      sala: "101",
      status: "Inativo",
      ano: "2025",
      situacao: "Em andamento",
    },
  ]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      {/* Cabeçalho e Botão */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#111827]">
          Gerenciar turmas
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm transition-all"
        >
          <Plus size={16} /> Nova turma
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquise por turmas"
              className="w-full border border-[#E5E7EB] rounded-xl p-3.5 pl-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search
              className="absolute right-4 top-4 text-gray-400"
              size={18}
            />
          </div>
          <button className="border border-[#E5E7EB] p-3 rounded-xl hover:bg-gray-50">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {["Nível de ensino", "Ano letivo", "Status"].map((label) => (
            <div key={label} className="relative">
              <select className="w-full border border-[#E5E7EB] rounded-xl p-3 text-sm appearance-none text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>{label}</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800">
            <X size={14} /> Limpar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F9FAFB] text-gray-500 uppercase font-bold border-b border-[#E5E7EB]">
            <tr>
              {[
                "Identificação",
                "Série",
                "Nível de Ensino",
                "Sala",
                "Status",
                "Ano Letivo",
                "Situação",
                "",
              ].map((h) => (
                <th key={h} className="px-6 py-5 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {turmas.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 text-center font-bold text-gray-950">
                  {t.identificacao}
                </td>
                <td className="px-6 py-5 text-center text-gray-600">
                  {t.serie}
                </td>
                <td className="px-6 py-5 text-center text-gray-600">
                  {t.nivel}
                </td>
                <td className="px-6 py-5 text-center text-gray-600">
                  {t.sala}
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.status === "Ativo" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center text-gray-600">{t.ano}</td>
                <td className="px-6 py-5 text-center text-gray-600">
                  {t.situacao}
                </td>
                <td className="px-6 py-5 text-center">
                  <button className="text-[#3B82F6] font-bold underline">
                    Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Corrigido */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-[600px] p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-950">Criar turma</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  ["Identificação", "Ex: 5º Semestre"],
                  ["Sala", "Ex: 101"],
                  ["Ano Letivo", "Ex: 2026"],
                  ["Série", "Ex: 5º"],
                ].map(([label, placeholder]) => (
                  <div key={label} className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      {label}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Nível de Ensino
                </label>
                <div className="relative">
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700">
                    <option>Selecione um nível...</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
                >
                  Criar turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
