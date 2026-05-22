'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  ChevronLeft, 
  ChevronRight,
  Info,
  BookOpen,
  Moon,
  LogOut,
  Clock,
  TrendingUp,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  LayoutDashboard,
  Star,
  Search,
  User
} from 'lucide-react';

export default function App() {
  // Estado para controlar a aba ativa no preview
  const [activeTab, setActiveTab] = useState('calendario');
  const [selectedDay, setSelectedDay] = useState(10);
  const [studentLevel, setStudentLevel] = useState('Fundamental II');
  const [expandedGrade, setExpandedGrade] = useState<number | null>(1);

  // --- DADOS MOCKADOS ---
  const student = { name: "João Pedro", year: studentLevel === 'Fundamental I' ? "3º ano" : "9º ano", level: studentLevel, class: "Turma B" };

  const subjects = [
    { id: 1, name: "Matemática", absences: 0, totalClasses: 20, average: 8.5, color: "#10B981", evaluations: [{ name: "Prova Bimestral", date: "09/03/2026", score: 8.5, max: 10 }, { name: "Trabalho: Geometria", date: "22/02/2026", score: 9.0, max: 10 }] },
    { id: 2, name: "Geografia", absences: 2, totalClasses: 20, average: 7.0, color: "#F59E0B", evaluations: [{ name: "Prova Bimestral", date: "09/03/2026", score: 7.0, max: 10 }] },
    { id: 3, name: "História", absences: 5, totalClasses: 20, average: 6.5, color: "#EF4444", evaluations: [{ name: "Simulado Geral", date: "05/03/2026", score: 6.5, max: 10 }] }
  ];

  const totalAttendanceFund1 = { totalClasses: 300, absences: 20, percentage: 93 };

  const daysWithEvents = [10, 12, 20, 25];
  const events = {
    10: [{ title: "Prova bimestral de Matemática", subject: "Matemática", color: "#EF4444" }],
    12: [{ title: "Entrega de Trabalho de Relevo", subject: "Geografia", color: "#F59E0B" }],
    20: [{ title: "Palestra de Preservação Ambiental", subject: "Geral", color: "#3B82F6" }],
    25: [{ title: "Seminário de História Antiga", subject: "História", color: "#EF4444" }]
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // --- SUB-COMPONENTES DE TELA ---

  // 1. Painel Geral (Dashboard)
  const PainelView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Olá, {student.name.split(' ')[0]}!</h1>
        <p className="text-gray-400 font-medium">Aqui está o resumo do seu desempenho escolar em {student.year}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
          <div className="bg-green-50 p-4 rounded-2xl text-green-500"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Média Geral</p>
            <h3 className="text-2xl font-black text-gray-900">7.3</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Frequência</p>
            <h3 className="text-2xl font-black text-gray-900">{studentLevel === 'Fundamental I' ? '93%' : '92%'}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
          <div className="bg-red-50 p-4 rounded-2xl text-red-500"><CalendarIcon size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Próxima Prova</p>
            <h3 className="text-lg font-black text-gray-900">Em 5 dias</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Avaliações Recentes</h2>
          <div className="space-y-4">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-white p-5 rounded-[24px] border border-gray-50 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: sub.color }}></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{sub.evaluations[0].name}</h4>
                    <p className="text-xs font-medium text-gray-400">{sub.name} • {sub.evaluations[0].date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black" style={{ color: sub.color }}>{sub.evaluations[0].score}</span>
                  <span className="text-[10px] font-bold text-gray-300 block">/ 10.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Agenda Próxima</h2>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-center min-w-[45px]">
                <span className="block text-[10px] font-black text-gray-300 uppercase">MAR</span>
                <span className="block text-xl font-black text-gray-900">10</span>
              </div>
              <div className="flex-1 p-3 rounded-2xl border-l-4 bg-red-50 border-red-500 text-red-700">
                <p className="text-xs font-bold leading-tight">Prova de Matemática</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-center min-w-[45px]">
                <span className="block text-[10px] font-black text-gray-300 uppercase">MAR</span>
                <span className="block text-xl font-black text-gray-900">12</span>
              </div>
              <div className="flex-1 p-3 rounded-2xl border-l-4 bg-orange-50 border-orange-400 text-orange-700">
                <p className="text-xs font-bold leading-tight">Trabalho de Geografia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. Frequência (Attendance)
  const FrequenciaView = () => {
    const isFund1 = studentLevel === 'Fundamental I';
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Frequência</h1>
            <p className="text-gray-400 font-medium text-sm">{student.year} • {student.level} • {student.class}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 flex items-center shadow-sm">
              <span className="font-bold text-gray-700">2026</span>
              <ChevronDown size={18} className="text-gray-300 ml-2" />
            </div>
          </div>
        </header>

        {isFund1 ? (
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke="#10B981" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * totalAttendanceFund1.percentage) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-gray-900">{totalAttendanceFund1.percentage}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presença</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Aulas Totais</p>
                <p className="text-2xl font-bold text-gray-900">{totalAttendanceFund1.totalClasses}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Faltas</p>
                <p className="text-2xl font-bold text-red-600">{totalAttendanceFund1.absences}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subjects.map((sub, i) => {
              const presencePercentage = Math.round(((sub.totalClasses - sub.absences) / sub.totalClasses) * 100);
              return (
                <div key={i} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 hover:shadow-md transition-all group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start space-x-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                        <LayoutDashboard size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#1A202C]">{sub.name}</h3>
                        <p className="text-sm font-medium text-gray-400 mt-1">{sub.class}</p>
                      </div>
                    </div>
                    <div className="flex-1 max-w-md w-full">  
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex space-x-6">
                          <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Realizadas</span>
                            <span className="text-lg font-bold text-gray-700">{sub.totalClasses}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Faltas</span>
                            <span className={`text-lg font-bold ${sub.absences > 0 ? 'text-red-500' : 'text-green-500'}`}>{sub.absences}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black" style={{ color: sub.color }}>{presencePercentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${presencePercentage}%`, backgroundColor: sub.color }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 3. Notas (Grades)
  const NotasView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">Notas</h1>
          <p className="text-gray-400 font-medium text-sm">Desempenho acadêmico consolidado.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-300" size={18} />
          <input type="text" placeholder="Buscar matéria..." className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 outline-none shadow-sm" />
        </div>
      </header>

      <div className="space-y-4">
        {subjects.map((sub) => (
          <div key={sub.id} className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
            <button onClick={() => setExpandedGrade(expandedGrade === sub.id ? null : sub.id)} className="w-full flex items-center justify-between p-7 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                  <LayoutDashboard size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-300 uppercase block tracking-wider">Média</span>
                  <span className="text-xl font-black" style={{ color: sub.color }}>{sub.average.toFixed(1)}</span>
                </div>
                {expandedGrade === sub.id ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
              </div>
            </button>

            {expandedGrade === sub.id && (
              <div className="px-7 pb-8 pt-2 border-t border-gray-50 bg-white">
                <div className="space-y-3">
                  {sub.evaluations.map((ev, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{ev.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1">DATA: {ev.date}</p>
                      </div>
                      <span className="text-lg font-black text-gray-800">{ev.score.toFixed(1)} / {ev.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 4. Calendário (Calendar)
  const CalendarioView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="grid grid-cols-7 gap-y-8 text-center">
              {weekDays.map((day) => (
                <div key={day} className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {day}
                </div>
              ))}

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
                    {hasEvent && !isSelected && (
                      <div className="absolute bottom-[-4px] w-1 h-1 bg-[#5D5FEF] rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
              Eventos do dia {selectedDay}
            </h2>
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

          <div className="bg-[#EFF6FF] p-6 rounded-[32px] border border-blue-50 flex items-start space-x-4">
            <div className="bg-blue-500 p-2 rounded-xl text-white"><Info size={20} /></div>
            <p className="text-xs font-semibold text-blue-700 leading-relaxed">
              As datas das provas e eventos podem sofrer alterações. Fique atento às notificações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A202C]">
      {/* HEADER INTEGRADO - IDÊNTICO AO CÓDIGO FORNECIDO */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-base">C</div>
            <span className="font-bold text-lg text-gray-900">Conecta Classe</span>
          </div>
          <nav className="flex gap-5">
            <button 
              onClick={() => setActiveTab('painel')}
              className={`text-sm font-semibold transition-all ${activeTab === 'painel' ? 'text-black border-b-2 border-black pb-1' : 'text-[#4b5563] hover:text-black'}`}
            >
              Painel Geral
            </button>
            <button 
              onClick={() => setActiveTab('frequencia')}
              className={`text-sm font-semibold transition-all ${activeTab === 'frequencia' ? 'text-black border-b-2 border-black pb-1' : 'text-[#4b5563] hover:text-black'}`}
            >
              Frequência
            </button>
            <button 
              onClick={() => setActiveTab('notas')}
              className={`text-sm font-semibold transition-all ${activeTab === 'notas' ? 'text-black border-b-2 border-black pb-1' : 'text-[#4b5563] hover:text-black'}`}
            >
              Notas
            </button>
            <button 
              onClick={() => setActiveTab('calendario')}
              className={`text-sm font-semibold transition-all ${activeTab === 'calendario' ? 'text-black border-b-2 border-black pb-1' : 'text-[#4b5563] hover:text-black'}`}
            >
              Calendário
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Seletor de Nível em Tempo Real para visualizarmos as regras de negócio */}
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 mr-2">
            <User size={14} className="text-gray-400 mr-2" />
            <select 
              value={studentLevel} 
              onChange={(e) => setStudentLevel(e.target.value)}
              className="text-xs bg-transparent border-none outline-none font-bold text-gray-600 cursor-pointer"
            >
              <option value="Fundamental I">Fund. 1</option>
              <option value="Fundamental II">Fund. 2</option>
              <option value="Médio">Médio</option>
            </select>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} className="text-[#4b5563] hover:text-black transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </header>

      {/* RENDERIZAÇÃO DA TELA ATIVA */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {activeTab === 'painel' && <PainelView />}
        {activeTab === 'frequencia' && <FrequenciaView />}
        {activeTab === 'notas' && <NotasView />}
        {activeTab === 'calendario' && <CalendarioView />}
      </main>
    </div>
  );
}