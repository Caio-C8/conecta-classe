'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Moon, 
  LogOut, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(10);
  
  // Mock de dias do mês de Março 2026 (começando no domingo)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 0; // Março 2026 começa no Domingo (1)

  // Dias que possuem eventos (para mostrar a bolinha embaixo)
  const daysWithEvents = [10, 12, 20, 25];

  const events = {
    10: [
      { title: "Prova bimestral de Matemática", subject: "Matemática", color: "#EF4444" }
    ],
    12: [
      { title: "Entrega de Trabalho", subject: "Geografia", color: "#3B82F6" }
    ],
    // Adicione mais eventos conforme necessário
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      {/* Navbar Padrão */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1A202C] p-2 rounded-xl text-white shadow-lg"><BookOpen size={22} /></div>
          <span className="text-xl font-bold tracking-tight">Conecta Classe</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-400">
          <span className="hover:text-gray-900 cursor-pointer">Painel</span>
          <span className="hover:text-gray-900 cursor-pointer">Frequência</span>
          <span className="hover:text-gray-900 cursor-pointer">Notas</span>
          <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Calendário</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <Moon size={20} className="cursor-pointer hover:text-gray-900" />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 border border-gray-200 cursor-pointer"><LogOut size={16} /></div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-black text-[#1A202C] tracking-tight">Março 2026</h1>
            <div className="flex space-x-1">
               <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronLeft size={20} /></button>
               <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 flex items-center shadow-sm">
            <div className="mr-4 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Ano Letivo</span>
              <span className="font-bold text-gray-700">2026</span>
            </div>
            <ChevronDown size={18} className="text-gray-300" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Lado Esquerdo: O Calendário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
              <div className="grid grid-cols-7 gap-y-8 text-center">
                {/* Dias da Semana */}
                {weekDays.map((day) => (
                  <div key={day} className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    {day}
                  </div>
                ))}

                {/* Grid de Dias */}
                {days.map((day) => {
                  const isSelected = selectedDay === day;
                  const hasEvent = daysWithEvents.includes(day);

                  return (
                    <div key={day} className="relative flex flex-col items-center justify-center h-12">
                      <button 
                        onClick={() => setSelectedDay(day)}
                        className={`
                          w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all
                          ${isSelected 
                            ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/30 scale-110' 
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {day}
                      </button>
                      
                      {/* Pontinho de Evento (não mostra se estiver selecionado, pois fica por cima) */}
                      {hasEvent && !isSelected && (
                        <div className="absolute bottom-[-4px] w-1 h-1 bg-[#5D5FEF] rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lado Direito: Detalhes do Dia */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
                Eventos do dia {selectedDay}
              </h2>
              
              <div className="space-y-4">
                {events[selectedDay as keyof typeof events] ? (
                  events[selectedDay as keyof typeof events].map((ev, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-start space-x-4 animate-in zoom-in-95 duration-300">
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

            {/* Banner Informativo */}
            <div className="bg-[#EFF6FF] p-6 rounded-[32px] border border-blue-50 flex items-start space-x-4">
              <div className="bg-blue-500 p-2 rounded-xl text-white"><Info size={20} /></div>
              <p className="text-xs font-semibold text-blue-700 leading-relaxed">
                As datas das provas e eventos podem sofrer alterações. Fique atento às notificações.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}