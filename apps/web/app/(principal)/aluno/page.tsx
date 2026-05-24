"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const pathname = usePathname();
  const student = {
    name: "João Pedro",
    year: "9º ano",
    level: "Fundamental II",
  };

  const recentGrades = [
    {
      subject: "Matemática",
      assessment: "Prova Bimestral",
      score: 8.5,
      date: "09/03",
    },
    {
      subject: "Geografia",
      assessment: "Trabalho em Grupo",
      score: 7.0,
      date: "07/03",
    },
    { subject: "História", assessment: "Simulado", score: 6.5, date: "05/03" },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">
            Olá, {student.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 font-medium">
            Aqui está o resumo do seu desempenho escolar em {student.year}.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
            <div className="bg-green-50 p-4 rounded-2xl text-green-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Média Geral
              </p>
              <h3 className="text-2xl font-black text-gray-900">7.3</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Frequência
              </p>
              <h3 className="text-2xl font-black text-gray-900">92%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all">
            <div className="bg-red-50 p-4 rounded-2xl text-red-500">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Próxima Prova
              </p>
              <h3 className="text-lg font-black text-gray-900">Em 5 dias</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Avaliações Recentes
            </h2>
            <div className="space-y-4">
              {recentGrades.map((grade, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-[24px] border border-gray-50 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-1.5 h-10 rounded-full ${grade.score >= 7 ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {grade.assessment}
                      </h4>
                      <p className="text-xs font-medium text-gray-400">
                        {grade.subject} • {grade.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xl font-black ${grade.score >= 7 ? "text-green-500" : "text-red-500"}`}
                    >
                      {grade.score}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 block">
                      / 10.0
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Agenda Próxima
            </h2>
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-center min-w-[45px]">
                  <span className="block text-[10px] font-black text-gray-300 uppercase">
                    MAR
                  </span>
                  <span className="block text-xl font-black text-gray-900">
                    10
                  </span>
                </div>
                <div className="flex-1 p-3 rounded-2xl border-l-4 bg-red-50 border-red-500 text-red-700">
                  <p className="text-xs font-bold leading-tight">
                    Prova de Matemática
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
