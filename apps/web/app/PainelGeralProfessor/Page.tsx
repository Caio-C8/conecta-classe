'use client';

import {
  FaGraduationCap,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaCalendar,
} from 'react-icons/fa';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] text-[#333] font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-gray-300 bg-white px-10 py-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <FaGraduationCap />
          <span>Conecta Classe</span>
        </div>

        <nav className="hidden md:flex gap-8">
          <a
            href="#"
            className="border-b-2 border-black pb-1 font-medium text-black"
          >
            Painel Geral
          </a>

          <a href="#" className="font-medium text-gray-600 hover:text-black">
            Frequência
          </a>

          <a href="#" className="font-medium text-gray-600 hover:text-black">
            Notas
          </a>

          <a href="#" className="font-medium text-gray-600 hover:text-black">
            Calendário
          </a>
        </nav>

        <button className="text-xl text-gray-700 hover:text-red-500 transition">
          <FaSignOutAlt />
        </button>
      </header>

      {/* CONTAINER */}
      <main className="px-6 md:px-14 py-8">
        {/* HEADER TEXT */}
        <section>
          <h1 className="text-3xl font-medium">Olá, João!</h1>
          <p className="mt-1 text-gray-500">
            Acompanhe seu desempenho em 9º ano / Fundamental II - Turma B.
          </p>
        </section>

        {/* CARDS */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Média Geral */}
          <div className="relative rounded-2xl bg-white p-5 shadow-md">
            <h4 className="text-sm text-gray-500">Média Geral</h4>

            <div className="mt-2 text-3xl font-semibold">7.3</div>

            <small className="mt-1 block text-sm text-green-600">
              ↑ +0.5 este mês
            </small>

            <div className="absolute top-5 right-5 text-blue-600 text-lg">
              <FaCheckCircle />
            </div>
          </div>

          {/* Frequência */}
          <div className="relative rounded-2xl bg-white p-5 shadow-md">
            <h4 className="text-sm text-gray-500">
              Frequência Geral
            </h4>

            <div className="mt-2 text-3xl font-semibold">92%</div>

            <small className="mt-1 block text-sm text-yellow-500">
              Atualizado em tempo real
            </small>

            <div className="absolute top-5 right-5 text-yellow-500 text-lg">
              <FaClock />
            </div>
          </div>

          {/* Próximo Evento */}
          <div className="relative rounded-2xl bg-white p-5 shadow-md">
            <h4 className="text-sm text-gray-500">
              Próximo Evento
            </h4>

            <div className="mt-2 text-2xl font-semibold">
              Trabalho de História
            </div>

            <small className="mt-1 block text-sm text-red-500">
              25/03/2026
            </small>

            <div className="absolute top-5 right-5 text-red-500 text-lg">
              <FaCalendar />
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* ESQUERDA */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Últimas Avaliações
              </h3>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver todas as notas
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {/* Item 1 */}
              <div className="flex items-center justify-between rounded-2xl border-l-[5px] border-green-600 bg-white p-4 shadow-md">
                <div>
                  <strong className="block">
                    Prova Bimestral
                  </strong>

                  <small className="text-gray-500">
                    Matemática • 15/03/2026
                  </small>
                </div>

                <div className="font-semibold text-green-600">
                  8.5 / 10
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between rounded-2xl border-l-[5px] border-green-600 bg-white p-4 shadow-md">
                <div>
                  <strong className="block">
                    Prova Bimestral
                  </strong>

                  <small className="text-gray-500">
                    Geografia • 18/03/2026
                  </small>
                </div>

                <div className="font-semibold text-green-600">
                  7.0 / 10
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between rounded-2xl border-l-[5px] border-red-500 bg-white p-4 shadow-md">
                <div>
                  <strong className="block">
                    Prova Bimestral
                  </strong>

                  <small className="text-gray-500">
                    História • 22/03/2026
                  </small>
                </div>

                <div className="font-semibold text-red-500">
                  6.5 / 10
                </div>
              </div>
            </div>
          </div>

          {/* DIREITA */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Agenda
              </h3>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver calendário
              </a>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md">
              {/* Item agenda */}
              <div className="mb-4 flex items-center gap-4">
                <div className="w-10 text-center text-sm text-gray-500">
                  <strong>ABR</strong>
                  <br />
                  15
                </div>

                <div className="flex-1 rounded-full bg-yellow-100 px-4 py-2 text-sm">
                  Entrega de Trabalho de História
                </div>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="w-10 text-center text-sm text-gray-500">
                  <strong>ABR</strong>
                  <br />
                  18
                </div>

                <div className="flex-1 rounded-full bg-red-100 px-4 py-2 text-sm">
                  Prova Bimestral de Matemática
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 text-center text-sm text-gray-500">
                  <strong>ABR</strong>
                  <br />
                  22
                </div>

                <div className="flex-1 rounded-full bg-blue-100 px-4 py-2 text-sm">
                  Feira de Ciências
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
