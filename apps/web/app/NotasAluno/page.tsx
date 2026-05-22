'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Moon, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Search,
  LayoutDashboard,
  Info
} from 'lucide-react';

export default function GradesPage() {
  const [expanded, setExpanded] = useState<number | null>(1);

  const subjects = [
    { 
      id: 1, 
      name: "Matemática", 
      average: 8.5, 
      color: "#10B981",
      evaluations: [
        { name: "Prova Bimestral", date: "09/03/2026", score: 8.5, max: 10 },
        { name: "Trabalho: Geometria", date: "22/02/2026", score: 9.0, max: 10 }
      ]
    },
    { 
      id: 2, 
      name: "Geografia", 
      average: 7.0, 
      color: "#F59E0B",
      evaluations: [
        { name: "Prova Bimestral", date: "09/03/2026", score: 7.0, max: 10 }
      ]
    },
    { 
      id: 3, 
      name: "História", 
      average: 6.5, 
      color: "#EF4444",
      evaluations: [
        { name: "Simulado Geral", date: "05/03/2026", score: 6.5, max: 10 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1A202C] p-2 rounded-xl text-white shadow-lg"><BookOpen size={22} /></div>
          <span className="text-xl font-bold tracking-tight">Conecta Classe</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-400">
          <span className="hover:text-gray-900 cursor-pointer">Painel</span>
          <span className="hover:text-gray-900 cursor-pointer">Frequência</span>
          <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Notas</span>
          <span className="hover:text-gray-900 cursor-pointer">Calendário</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <Moon size={20} className="cursor-pointer hover:text-gray-900" />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 border border-gray-200 cursor-pointer"><LogOut size={16} /></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Notas</h1>
            <p className="text-gray-400 font-medium text-sm">Desempenho acadêmico por disciplina.</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar matéria..." 
              className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm w-full md:w-64 transition-all"
            />
          </div>
        </header>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-[32px] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
              <button 
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                className="w-full flex items-center justify-between p-7 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                    <LayoutDashboard size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Média Geral</span>
                    <span className="text-xl font-black" style={{ color: sub.color }}>{sub.average.toFixed(1)}</span>
                  </div>
                  {expanded === sub.id ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                </div>
              </button>

              {expanded === sub.id && (
                <div className="px-7 pb-8 pt-2 border-t border-gray-50 bg-white">
                  <div className="mb-6 flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span>Detalhe das avaliações</span>
                  </div>
                  <div className="space-y-3">
                    {sub.evaluations.map((ev, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{ev.name}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">Data: {ev.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-black ${ev.score >= 7 ? 'text-green-500' : 'text-red-500'}`}>{ev.score}</span>
                          <span className="text-[10px] font-bold text-gray-300 ml-1">/ {ev.max}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-start space-x-4">
          <div className="bg-[#EFF6FF] p-3 rounded-2xl text-blue-500"><Info size={24} /></div>
          <div>
            <h4 className="text-blue-900 font-bold text-sm uppercase tracking-widest mb-1">Acompanhamento</h4>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">As notas são atualizadas conforme o fechamento dos professores. Caso note alguma divergência, entre em contato com a secretaria.</p>
          </div>
        </div>
      </main>
    </div>
  );
}