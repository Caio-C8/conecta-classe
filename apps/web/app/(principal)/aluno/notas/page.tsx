'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  LayoutDashboard,
  Info
} from 'lucide-react';

export default function GradesPage() {
  const pathname = usePathname();
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
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      {/* HEADER INTEGRADO */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-base">C</div>
            <span className="font-bold text-lg text-gray-900">Conecta Classe</span>
          </div>
          <nav className="flex gap-5">
            <Link href="/painel" className={`text-sm no-underline ${pathname === '/painel' ? 'text-black font-semibold' : 'text-[#4b5563] hover:text-black'}`}>Painel Geral</Link>
            <Link href="/frequencia" className={`text-sm no-underline ${pathname === '/frequencia' ? 'text-black font-semibold' : 'text-[#4b5563] hover:text-black'}`}>Frequência</Link>
            <Link href="/notas" className={`text-sm no-underline ${pathname === '/notas' ? 'text-black font-semibold' : 'text-[#4b5563] hover:text-black'}`}>Notas</Link>
            <Link href="/calendario" className={`text-sm no-underline ${pathname === '/calendario' ? 'text-black font-semibold' : 'text-[#4b5563] hover:text-black'}`}>Calendário</Link>
          </nav>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} className="text-[#4b5563] hover:text-black">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Notas</h1>
            <p className="text-gray-400 font-medium text-sm">Acompanhe suas notas bimestrais.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-300" size={18} />
            <input type="text" placeholder="Buscar matéria..." className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 outline-none" />
          </div>
        </header>

        <div className="space-y-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
              <button onClick={() => setExpanded(expanded === sub.id ? null : sub.id)} className="w-full flex items-center justify-between p-7 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                    <LayoutDashboard size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-xl font-black" style={{ color: sub.color }}>{sub.average.toFixed(1)}</span>
                  {expanded === sub.id ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                </div>
              </button>

              {expanded === sub.id && (
                <div className="px-7 pb-8 pt-2 border-t border-gray-50 bg-white">
                  <div className="space-y-3">
                    {sub.evaluations.map((ev, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{ev.name}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1">Data: {ev.date}</p>
                        </div>
                        <span className="text-lg font-black text-gray-800">{ev.score} / {ev.max}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}