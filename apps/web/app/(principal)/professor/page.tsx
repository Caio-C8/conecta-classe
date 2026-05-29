export default function HomeProfessor() {
  return (
    <>
      <section>
        <h1 className="mb-8 text-3xl font-medium">Olá, João Lucas</h1>

        <h2 className="mb-4 text-lg font-medium">Minhas Turmas:</h2>

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

            <p className="mb-4 text-sm text-gray-700">32 alunos matriculados</p>

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

            <p className="mb-4 text-sm text-gray-700">28 alunos matriculados</p>

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

            <p className="mb-4 text-sm text-gray-700">31 alunos matriculados</p>

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
              <h4 className="text-sm font-medium">Avaliação Mensal</h4>

              <small className="text-gray-500">
                8º Ano A • Ocorreu há 3 dias
              </small>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:underline">
              Lançar
            </a>
          </div>

          <div className="flex items-center justify-between rounded-xl border-l-4 border-red-500 bg-slate-50 p-3">
            <div>
              <h4 className="text-sm font-medium">Trabalho de Relevo</h4>

              <small className="text-gray-500">9º Ano B • Ocorreu ontem</small>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:underline">
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
              <h4 className="text-sm font-medium">Entrega de Maquete</h4>

              <small className="text-gray-500">1º Ano C • Encerra amanhã</small>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:underline">
              Ver
            </a>
          </div>

          <div className="flex items-center justify-between rounded-xl border-l-4 border-yellow-500 bg-slate-50 p-3">
            <div>
              <h4 className="text-sm font-medium">Seminário: Clima</h4>

              <small className="text-gray-500">8º Ano A • Em 3 dias</small>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:underline">
              Ver
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
