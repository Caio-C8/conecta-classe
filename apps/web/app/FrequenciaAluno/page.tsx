'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Moon, 
  LogOut, 
  Clock, 
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Info,
  TrendingUp
} from 'lucide-react';

// Nota: Em um projeto real, você importaria estes tipos de @conecta-classe/types
interface Subject {
  id: number;
  name: string;
  class: string;
  totalClasses: number;
  absences: number;
  color: string;
}

export default function FrequencyPage() {
  const [studentLevel, setStudentLevel] = useState<'FUND1' | 'MEDIO'>('MEDIO');

  const subjects: Subject[] = [
    { id: 1, name: "Matemática", class: "Turma B / 9º ano / Fundamental II", totalClasses: 20, absences: 0, color: "#10B981" },
    { id: 2, name: "Geografia", class: "Turma B / 9º ano / Fundamental II", totalClasses: 20, absences: 2, color: "#F59E0B" },
    { id: 3, name: "História", class: "Turma B / 9º ano / Fundamental II", totalClasses: 20, absences: 5, color: "#EF4444" }
  ];

  const totalAttendance = {
    totalClasses: 300,
    absences: 20,
    percentage: 93
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      {/* Navbar Superior (Adaptada para o estilo do Conecta Classe) */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1A202C] p-2 rounded-xl text-white shadow-lg">
            <BookOpen size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight">Conecta Classe</span>
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-400">
          <span className="hover:text-gray-900 cursor-pointer">Painel</span>
          <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Frequência</span>
          <span className="hover:text-gray-900 cursor-pointer">Notas</span>
          <span className="hover:text-gray-900 cursor-pointer">Calendário</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Seletor de Nível para teste (Simulando contexto do usuário) */}
          <select 
            onChange={(e) => setStudentLevel(e.target.value as 'FUND1' | 'MEDIO')}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none"
          >
            <option value="MEDIO">Modo: Ensino Médio</option>
            <option value="FUND1">Modo: Fundamental 1</option>
          </select>
          <Moon size={20} className="text-gray-400 cursor-pointer hover:text-gray-900" />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 border border-gray-200 cursor-pointer">
            <LogOut size={16} />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Header da Página */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Frequência</h1>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-gray-400 font-medium text-sm">Status: Regular em todas as disciplinas</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 flex items-center shadow-sm">
            <div className="mr-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Ano Letivo</span>
              <span className="font-bold text-gray-700">2026</span>
            </div>
            <ChevronDown size={18} className="text-gray-300" />
          </div>
        </header>

        {/* Lógica Condicional baseada no RF04 */}
        {studentLevel === 'FUND1' ? (
          /* Visual Consolidado para Fundamental 1 */
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="85" stroke="#F1F5F9" strokeWidth="16" fill="transparent" />
                  <circle 
                    cx="96" cy="96" r="85" stroke="#10B981" strokeWidth="16" fill="transparent" 
                    strokeDasharray="534" strokeDashoffset={534 - (534 * totalAttendance.percentage) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1A202C]">{totalAttendance.percentage}%</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presença</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Total de Aulas</p>
                  <p className="text-3xl font-black text-[#1A202C]">{totalAttendance.totalClasses}</p>
                </div>
                <div className="bg-[#FEF2F2] p-6 rounded-3xl border border-red-50">
                  <p className="text-[10px] font-bold text-red-400 uppercase mb-2">Faltas</p>
                  <p className="text-3xl font-black text-red-600">{totalAttendance.absences}</p>
                </div>
                <div className="col-span-2 bg-[#EFF6FF] p-5 rounded-2xl flex items-center text-blue-700">
                  <Info size={20} className="mr-3" />
                  <p className="text-sm font-semibold">Frequência geral consolidada conforme requisitos do Fundamental 1.</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Visual Detalhado para Fundamental 2 / Médio */
          <section className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {subjects.map((sub) => {
              const presencePercentage = Math.round(((sub.totalClasses - sub.absences) / sub.totalClasses) * 100);
              return (
                <div key={sub.id} className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-md transition-all group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-start space-x-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                        <LayoutDashboard size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#1A202C]">{sub.name}</h3>
                        <p className="text-sm font-medium text-gray-400 mt-1">{sub.class}</p>
                      </div>
                    </div>

                    <div className="flex-1 max-w-md w-full">
                      <div className="flex justify-between items-end mb-3 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                        <div className="flex space-x-6">
                          <div><span className="block text-gray-300">Aulas</span><span className="text-lg text-gray-700">{sub.totalClasses}</span></div>
                          <div><span className="block text-gray-300">Faltas</span><span className={`text-lg ${sub.absences > 0 ? 'text-red-500' : 'text-green-500'}`}>{sub.absences}</span></div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl text-gray-900" style={{ color: sub.color }}>{presencePercentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${presencePercentage}%`, backgroundColor: sub.color }} />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                      <div className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold ${sub.absences > 4 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                        {sub.absences > 4 ? <AlertCircle size={14} className="mr-2" /> : <CheckCircle2 size={14} className="mr-2" />}
                        {sub.absences > 4 ? 'Alerta' : 'Normal'}
                      </div>
                      <MoreVertical size={20} className="text-gray-300 cursor-pointer" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <footer className="mt-12 bg-[#F0F7FF] border border-blue-50 rounded-3xl p-6 flex items-start space-x-4">
          <div className="bg-blue-500 p-2 rounded-lg text-white"><Info size={20} /></div>
          <div>
            <h4 className="text-blue-900 font-bold text-sm uppercase tracking-wider mb-1">Dica de Aprovação</h4>
            <p className="text-blue-700 text-sm leading-relaxed">Mantenha sua frequência acima de 75% em todas as matérias para evitar reprovação por faltas.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}