"use client";

import { FaBook, FaPlus, FaThLarge, FaUser, FaUserTie } from "react-icons/fa";

export default function HomeAdmin() {
  return (
    <>
      {/* TOP */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-medium">Olá, Joana Oliveira</h1>

        <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500">
          <option>2025</option>
          <option>2024</option>
        </select>
      </section>

      {/* CARDS */}
      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Card 1 */}
        <div className="relative rounded-2xl bg-white p-5 shadow-md">
          <div className="absolute right-5 top-5 text-gray-500">
            <FaUser />
          </div>

          <h3 className="mb-2 text-sm text-gray-500">Alunos Cursando</h3>

          <div className="mb-2 text-3xl font-semibold">104</div>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Ver detalhes
          </a>
        </div>

        {/* Card 2 */}
        <div className="relative rounded-2xl bg-white p-5 shadow-md">
          <div className="absolute right-5 top-5 text-gray-500">
            <FaUserTie />
          </div>

          <h3 className="mb-2 text-sm text-gray-500">Professores Ativos</h3>

          <div className="mb-2 text-3xl font-semibold">18</div>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Ver detalhes
          </a>
        </div>

        {/* Card 3 */}
        <div className="relative rounded-2xl bg-white p-5 shadow-md">
          <div className="absolute right-5 top-5 text-gray-500">
            <FaThLarge />
          </div>

          <h3 className="mb-2 text-sm text-gray-500">Turmas Em Andamento</h3>

          <div className="mb-2 text-3xl font-semibold">4</div>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Ver detalhes
          </a>
        </div>

        {/* Card 4 */}
        <div className="relative rounded-2xl bg-white p-5 shadow-md">
          <div className="absolute right-5 top-5 text-gray-500">
            <FaBook />
          </div>

          <h3 className="mb-2 text-sm text-gray-500">
            Disciplinas Cadastradas
          </h3>

          <div className="mb-2 text-3xl font-semibold">20</div>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Ver detalhes
          </a>
        </div>
      </section>

      {/* SHORTCUTS */}
      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-medium">Atalhos Rápidos</h2>

        <div className="flex flex-col gap-4 md:flex-row">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white transition hover:opacity-90">
            <FaPlus />
            Novo usuário
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white transition hover:opacity-90">
            <FaPlus />
            Nova turma
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-white transition hover:opacity-90">
            <FaPlus />
            Nova disciplina
          </button>
        </div>
      </section>
    </>
  );
}
