'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function CalendarPage() {
  const pathname = usePathname();
  const [selectedDay, setSelectedDay] = useState(10);
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const daysWithEvents = [10, 12, 20, 25];

  const events = {
    10: [{ title: "Prova bimestral de Matemática", subject: "Matemática", color: "#EF4444" }],
    12: [{ title: "Entrega de Trabalho", subject: "Geografia", color: "#3B82F6" }]
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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

      <main className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-black text-[#1A202C] tracking-tight">Março 2026</h1>
            <div className="flex space-x-1">
               <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronLeft size={20} /></button>
               <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronRight size={20} /></button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
              <div className="grid grid-cols-7 gap-y-8 text-center">
                {weekDays.map((day) => (
                  <div key={day} className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{day}</div>
                ))}
                {days.map((day) => {
                  const isSelected = selectedDay === day;
                  const hasEvent = daysWithEvents.includes(day);
                  return (
                    <div key={day} className="relative flex flex-col items-center justify-center h-12">
                      <button 
                        onClick={() => setSelectedDay(day)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all ${isSelected ? 'bg-[#5D5FEF] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {day}
                      </button>
                      {hasEvent && !isSelected && <div className="absolute bottom-[-4px] w-1 h-1 bg-[#5D5FEF] rounded-full"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Eventos do dia {selectedDay}</h2>
              <div className="space-y-4">
                {events[selectedDay as keyof typeof events] ? (
                  events[selectedDay as keyof typeof events].map((ev, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: ev.color }}></div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{ev.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{ev.subject}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[32px] p-10 text-center">
                    <p className="text-sm font-medium text-gray-400">Nenhum evento para este dia.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
