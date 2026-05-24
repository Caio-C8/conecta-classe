"use client";

import React from "react";
import {
  Users,
  GraduationCap,
  Layers,
  BookMarked,
  Plus,
  Moon,
  ChevronDown,
} from "lucide-react";

// Simulação dos componentes do Next.js para garantir que o código compile no ambiente de visualização do Canvas.
// No seu projeto Next.js real do VS Code, você pode descomentar e usar:
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
const Link = ({ href, children, className, ...props }: any) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

const usePathname = () => {
  return "/admin"; // Simula a rota ativa atual do painel do administrador
};

export default function AdminDashboardPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-[#1F2937] font-sans antialiased">
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
                Olá, Joana Oliveira
              </h1>
              <p className="text-gray-500 font-medium">
                Seja bem-vinda de volta ao painel administrativo.
              </p>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Ano letivo
              </span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
                  <option>2025</option>
                  <option>2026</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Grid de Cards Estatísticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] relative flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Alunos Cursando
                </span>
                <Users size={20} className="text-[#4B5563]" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                  104
                </h3>
                <Link
                  href="/admin/usuarios"
                  className="text-xs font-bold text-[#3B82F6] hover:underline uppercase tracking-wider no-underline"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] relative flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Professores Ativos
                </span>
                <GraduationCap size={20} className="text-[#4B5563]" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                  18
                </h3>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider cursor-not-allowed">
                  Ver detalhes
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] relative flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Turmas em Andamento
                </span>
                <Layers size={20} className="text-[#4B5563]" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                  4
                </h3>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider cursor-not-allowed">
                  Ver detalhes
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_6px_rgba(0,0,0,0.02)] relative flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Disciplinas
                </span>
                <BookMarked size={20} className="text-[#4B5563]" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
                  20
                </h3>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider cursor-not-allowed">
                  Ver detalhes
                </span>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              Atalhos Rápidos
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/usuarios"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all no-underline text-sm"
              >
                <Plus size={18} /> Novo usuário
              </Link>
              <button className="bg-[#3B82F6] opacity-60 cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-sm">
                <Plus size={18} /> Nova turma
              </button>
              <button className="bg-[#3B82F6] opacity-60 cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-sm">
                <Plus size={18} /> Nova disciplina
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
