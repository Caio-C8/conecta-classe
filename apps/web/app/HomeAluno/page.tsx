'use client';

import React from 'react';
import { 
  BookOpen, 
  Moon, 
  LogOut, 
  TrendingUp, 
  Clock, 
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

export default function DashboardPage() {
  const student = { name: "João Pedro", year: "9º ano", level: "Fundamental II" };

  const recentGrades = [
    { subject: "Matemática", assessment: "Prova Bimestral", score: 8.5, date: "09/03" },
    { subject: "Geografia", assessment: "Trabalho em Grupo", score: 7.0, date: "07/03" },
    { subject: "História", assessment: "Simulado", score: 6.5, date: "05/03" },
  ];

  const upcomingEvents = [
    { title: "Entrega: Trabalho de Artes", date: "15 Abr", type: "warning" },
    { title: "Prova de Inglês", date: "18 Abr", type: "danger" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      {/* Navbar - Reutilizando o padrão do projeto */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1A202C] p-2 rounded-xl text-white shadow-lg"><BookOpen size={22} /></div>
          <span className="text-xl font-bold tracking-tight">Conecta Classe</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-400">
          <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Painel</span>
          <span className="hover:text-gray-900 cursor-pointer">Frequência</span>
          <span className="hover:text-gray-900 cursor-pointer">Notas</span>
          <span className="hover:text-gray-900 cursor-pointer">Calendário</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <Moon size={20} className="cursor-pointer hover:text-gray-900" />
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 border border-gray-200 cursor-pointer"><LogOut size={16} /></div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Olá, {student.name.split(' ')[0]}!</h1>
          <p className="text-gray-400 font-medium">Aqui está o resumo do seu desempenho escolar.</p>
        </header>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-1000">
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
            <div className="bg-green-50 p-4 rounded-2xl text-green-500"><TrendingUp size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Média Geral</p>
              <h3 className="text-2xl font-black text-gray-900">7.3</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><Clock size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Frequência</p>
              <h3 className="text-2xl font-black text-gray-900">92%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
            <div className="bg-red-50 p-4 rounded-2xl text-red-500"><CalendarIcon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Próxima Prova</p>
              <h3 className="text-lg font-black text-gray-900">Em 5 dias</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna de Notas Recentes */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Avaliações Recentes</h2>
              <button className="text-xs font-bold text-blue-500 hover:underline">Ver todas</button>
            </div>
            <div className="space-y-4">
              {recentGrades.map((grade, i) => (
                <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-50 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`w-1.5 h-10 rounded-full ${grade.score >= 7 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{grade.assessment}</h4>
                      <p className="text-xs font-medium text-gray-400">{grade.subject} • {grade.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black ${grade.score >= 7 ? 'text-green-500' : 'text-red-500'}`}>{grade.score}</span>
                    <span className="text-[10px] font-bold text-gray-300 block">/ 10.0</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Coluna de Agenda */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Agenda</h2>
              <CalendarIcon size={20} className="text-gray-300" />
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-6">
              {upcomingEvents.map((ev, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="text-center min-w-[45px]">
                    <span className="block text-[10px] font-black text-gray-300 uppercase">{ev.date.split(' ')[1]}</span>
                    <span className="block text-xl font-black text-gray-900">{ev.date.split(' ')[0]}</span>
                  </div>
                  <div className={`flex-1 p-3 rounded-2xl border-l-4 ${ev.type === 'danger' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-orange-50 border-orange-400 text-orange-700'}`}>
                    <p className="text-xs font-bold leading-tight">{ev.title}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 bg-gray-50 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-colors">Ver Calendário Completo</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}