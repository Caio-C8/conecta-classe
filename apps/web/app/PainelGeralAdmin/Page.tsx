'use client';

import {
  FaGraduationCap,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-gray-300 bg-white px-6 py-4 md:px-10">
        <div className="flex items-center gap-2 text-lg font-semibold">
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

          <a
            href="#"
            className="font-medium text-gray-600 hover:text-black transition"
          >
            Frequência
          </a>

          <a
            href="#"
            className="font-medium text-gray-600 hover:text-black transition"
          >
            Criar Evento
          </a>

          <a
            href="#"
            className="font-medium text-gray-600 hover:text-black transition"
          >
            Gerenciar Eventos
          </a>
        </nav>

        <button className="text-xl text-gray-700 hover:text-red-500 transition">
          <FaSignOutAlt />
        </button>
      </header>

      {/* CONTAINER */}
      <main className="grid grid-cols-1 gap-8 px-6 py-8 md:px-14 lg:grid-cols-[2fr_1fr]">
        {/* ESQUERDA */}
        <section>
          <h1 className="mb-8 text-3xl font-medium">
            Olá, João Lucas
          </h1>

          <h2 className="mb-4 text-lg font-medium">
            Minhas Turmas:
          </h2>

          {/* TURMAS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-2xl bg-white p-5 shadow-md">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                8º Ano A
              </h3>

              <small className="mb-3 block text-gray-500">
                Ensino Fundamental II - Geografia
              </small>

              <p className="mb-4 text-sm text-gray-700">
                32 alunos matriculados
              </p>

              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Fazer Chamada
                </button>

                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Eventos
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white p-5 shadow-md">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                9º Ano B
              </h3>

              <small className="mb-3 block text-gray-500">
                Ensino Fundamental II - Geografia
              </small>

              <p className="mb-4 text-sm text-gray-700">
                28 alunos matriculados
              </p>

              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Fazer Chamada
                </button>

                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Eventos
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white p-5 shadow-md">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                1º Ano C
              </h3>

              <small className="mb-3 block text-gray-500">
                Ensino Médio - Geografia
              </small>

              <p className="mb-4 text-sm text-gray-700">
                31 alunos matriculados
              </p>

              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Fazer Chamada
                </button>

                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white transition hover:opacity-90">
                  Eventos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DIREITA */}
        <aside className="flex flex-col gap-5">
          {/* NOTAS PENDENTES */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <strong>Notas Pendentes:</strong>

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
                2
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-xl border-l-4 border-red-500 bg-slate-50 p-3">
              <div>
                <h4 className="text-sm font-medium">
                  Avaliação Mensal
                </h4>

                <small className="text-gray-500">
                  8º Ano A • Ocorreu há 3 dias
                </small>
              </div>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Lançar
              </a>
            </div>

            <div className="flex items-center justify-between rounded-xl border-l-4 border-red-500 bg-slate-50 p-3">
              <div>
                <h4 className="text-sm font-medium">
                  Trabalho de Relevo
                </h4>

                <small className="text-gray-500">
                  9º Ano B • Ocorreu ontem
                </small>
              </div>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Lançar
              </a>
            </div>
          </div>

          {/* PRÓXIMAS ATIVIDADES */}
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <div className="mb-4">
              <strong>Próximas Atividades</strong>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-xl border-l-4 border-yellow-500 bg-slate-50 p-3">
              <div>
                <h4 className="text-sm font-medium">
                  Entrega de Maquete
                </h4>

                <small className="text-gray-500">
                  1º Ano C • Encerra amanhã
                </small>
              </div>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver
              </a>
            </div>

            <div className="flex items-center justify-between rounded-xl border-l-4 border-yellow-500 bg-slate-50 p-3">
              <div>
                <h4 className="text-sm font-medium">
                  Seminário: Clima
                </h4>

                <small className="text-gray-500">
                  8º Ano A • Em 3 dias
                </small>
              </div>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver
              </a>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
