"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Info,
} from "lucide-react";

export default function AttendancePage() {
  const pathname = usePathname();
  const [studentLevel] = useState("Fundamental II");

  const subjects = [
    {
      name: "Matemática",
      class: "Turma B / 9º ano / Fundamental II",
      totalClasses: 20,
      absences: 0,
      color: "#10B981",
    },
    {
      name: "Geografia",
      class: "Turma B / 9º ano / Fundamental II",
      totalClasses: 20,
      absences: 2,
      color: "#F59E0B",
    },
    {
      name: "História",
      class: "Turma B / 9º ano / Fundamental II",
      totalClasses: 20,
      absences: 5,
      color: "#EF4444",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-8 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A202C] mb-2 tracking-tight">
              Frequência
            </h1>
            <p className="text-gray-400 font-medium text-sm">
              9º ano / Fundamental II
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 flex items-center shadow-sm">
            <span className="font-bold text-gray-700">2026</span>
            <ChevronDown size={18} className="text-gray-300 ml-2" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {subjects.map((sub, i) => {
            const presencePercentage = Math.round(
              ((sub.totalClasses - sub.absences) / sub.totalClasses) * 100,
            );
            return (
              <div
                key={i}
                className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start space-x-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${sub.color}15`,
                        color: sub.color,
                      }}
                    >
                      <LayoutDashboard size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A202C]">
                        {sub.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        {sub.class}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md w-full">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex space-x-6">
                        <div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">
                            Realizadas
                          </span>
                          <span className="text-lg font-bold text-gray-700">
                            {sub.totalClasses}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">
                            Faltas
                          </span>
                          <span
                            className={`text-lg font-bold ${sub.absences > 0 ? "text-red-500" : "text-green-500"}`}
                          >
                            {sub.absences}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-2xl font-black"
                          style={{ color: sub.color }}
                        >
                          {presencePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${presencePercentage}%`,
                          backgroundColor: sub.color,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end lg:space-x-4 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0">
                    <div
                      className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold ${sub.absences > 4 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"}`}
                    >
                      {sub.absences > 4 ? (
                        <AlertCircle size={14} className="mr-2" />
                      ) : (
                        <CheckCircle2 size={14} className="mr-2" />
                      )}
                      {sub.absences > 4 ? "Alerta" : "Frequência Ok"}
                    </div>
                    <button className="p-2 text-gray-300 hover:text-gray-900">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
