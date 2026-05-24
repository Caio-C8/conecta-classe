"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  Moon,
  ChevronDown,
  User,
  SlidersHorizontal,
} from "lucide-react";

// Simulação dos componentes do Next.js para garantir que o código compile no ambiente de visualização do Canvas.
// No seu projeto Next.js real do VS Code, você pode descomentar e usar:
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
const Link = ({ href, children, className, ...props }: any) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

const usePathname = () => {
  return "/admin/usuarios"; // Simula a rota ativa atual
};

interface Usuario {
  id: number;
  nome: string;
  usuario: string;
  tipo: "Aluno" | "Professor" | "Administrador";
  cargo: string;
  status: "Ativo" | "Inativo";
  statusMatricula: "Cursando" | "Trancado" | "Concluído" | "-";
}

export default function AdminUsersPage() {
  const pathname = usePathname();

  // Lista inicial de usuários baseada na imagem enviada
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "Marcela Maria",
      usuario: "marcelam",
      tipo: "Aluno",
      cargo: "-",
      status: "Ativo",
      statusMatricula: "Cursando",
    },
    {
      id: 2,
      nome: "João Lucas",
      usuario: "joaol",
      tipo: "Professor",
      cargo: "-",
      status: "Inativo",
      statusMatricula: "-",
    },
    {
      id: 3,
      nome: "Joana Oliveira",
      usuario: "joana",
      tipo: "Administrador",
      cargo: "Secretário",
      status: "Inativo",
      statusMatricula: "-",
    },
  ]);

  // Estados dos Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  // Estados dos Formulários
  const [formTipo, setFormTipo] = useState<
    "Aluno" | "Professor" | "Administrador"
  >("Aluno");
  const [formNome, setFormNome] = useState("");
  const [formUsuario, setFormUsuario] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formCargo, setFormCargo] = useState("Secretário");
  const [formEditarSenha, setFormEditarSenha] = useState(false);

  // Estados dos Filtros Avançados
  const [filterPesquisa, setFilterPesquisa] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterCargo, setFilterCargo] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterMatricula, setFilterMatricula] = useState("Todos");

  // Abrir modal de criação
  const handleOpenCreate = () => {
    setFormTipo("Aluno");
    setFormNome("");
    setFormUsuario("");
    setFormSenha("");
    setFormCargo("Secretário");
    setFormEditarSenha(false);
    setIsCreateModalOpen(true);
  };

  // Salvar novo usuário criado pelo formulário
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Usuario = {
      id: Date.now(),
      nome: formNome,
      usuario: formUsuario,
      tipo: formTipo,
      cargo: formTipo === "Administrador" ? formCargo : "-",
      status: "Ativo",
      statusMatricula: formTipo === "Aluno" ? "Cursando" : "-",
    };
    setUsuarios([...usuarios, novo]);
    setIsCreateModalOpen(false);
  };

  // Abrir modal de edição com os dados preenchidos (igual à última imagem)
  const handleOpenEdit = (usuario: Usuario) => {
    setCurrentUser(usuario);
    setFormTipo(usuario.tipo);
    setFormNome(usuario.nome);
    setFormUsuario(usuario.usuario);
    setFormSenha("");
    setFormCargo(usuario.cargo !== "-" ? usuario.cargo : "Secretário");
    setFormEditarSenha(false);
    setIsEditModalOpen(true);
  };

  // Salvar alterações de edição
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setUsuarios(
      usuarios.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              nome: formNome,
              usuario: formUsuario,
              tipo: formTipo,
              cargo: formTipo === "Administrador" ? formCargo : "-",
              status: currentUser.status, // Preserva o status atual modificado pelo botão "Ativar/Inativar"
              statusMatricula: formTipo === "Aluno" ? "Cursando" : "-",
            }
          : u,
      ),
    );

    setIsEditModalOpen(false);
  };

  // Alternar Status Ativo/Inativo na edição (botão azul na parte inferior esquerda do modal)
  const toggleStatus = () => {
    if (!currentUser) return;
    const novoStatus = currentUser.status === "Ativo" ? "Inativo" : "Ativo";
    setCurrentUser({ ...currentUser, status: novoStatus });
    setUsuarios(
      usuarios.map((u) =>
        u.id === currentUser.id ? { ...u, status: novoStatus } : u,
      ),
    );
  };

  const limparFiltros = () => {
    setFilterPesquisa("");
    setFilterTipo("Todos");
    setFilterCargo("Todos");
    setFilterStatus("Todos");
    setFilterMatricula("Todos");
  };

  // Filtros aplicados na tabela de usuários cadastrados
  const usuariosFiltrados = usuarios.filter((u) => {
    const batePesquisa =
      u.nome.toLowerCase().includes(filterPesquisa.toLowerCase()) ||
      u.usuario.toLowerCase().includes(filterPesquisa.toLowerCase());
    const bateTipo =
      filterTipo === "Todos" ||
      filterTipo === "Selecione o tipo" ||
      u.tipo === filterTipo;
    const bateCargo =
      filterCargo === "Todos" ||
      filterCargo === "Selecione o cargo" ||
      u.cargo === filterCargo;
    const bateStatus =
      filterStatus === "Todos" ||
      filterStatus === "Status do usuário" ||
      u.status === filterStatus;
    const bateMatricula =
      filterMatricula === "Todos" ||
      filterMatricula === "Status da matrícula" ||
      u.statusMatricula === filterMatricula;
    return batePesquisa && bateTipo && bateCargo && bateStatus && bateMatricula;
  });

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-[#1F2937] font-sans antialiased">
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Usuários cadastrados
            </h1>
            <button
              onClick={handleOpenCreate}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-sm"
            >
              <Plus size={16} /> Novo usuário
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Pesquise por usuários"
                value={filterPesquisa}
                onChange={(e) => setFilterPesquisa(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] shadow-sm"
              />
              <Search
                size={18}
                className="absolute right-4 top-4 text-gray-400"
              />
            </div>
            <button className="bg-white border border-[#E5E7EB] px-4 rounded-xl hover:bg-gray-50 text-gray-700 shadow-sm transition-colors flex items-center justify-center">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Filtros Avançados */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-[0_4px_30px_rgba(0,0,0,0.02)] mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#4B5563] uppercase tracking-wider">
                Tipo de usuário:
              </label>
              <div className="relative">
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option>Selecione o tipo</option>
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                  <option value="Administrador">Administrador</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#4B5563] uppercase tracking-wider">
                Cargo de administrador:
              </label>
              <div className="relative">
                <select
                  value={filterCargo}
                  onChange={(e) => setFilterCargo(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option>Selecione o cargo</option>
                  <option value="Secretário">Secretário</option>
                  <option value="Diretor">Diretor</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#4B5563] uppercase tracking-wider">
                Status:
              </label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option>Status do usuário</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#4B5563] uppercase tracking-wider">
                Status (Matrícula):
              </label>
              <div className="relative">
                <select
                  value={filterMatricula}
                  onChange={(e) => setFilterMatricula(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option>Status da matrícula</option>
                  <option value="Cursando">Cursando</option>
                  <option value="Trancado">Trancado</option>
                  <option value="Concluído">Concluído</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <button
              onClick={limparFiltros}
              className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm border border-gray-200"
            >
              <X size={16} /> Limpar
            </button>
          </div>

          {/* Tabela de Usuários */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-6">
            <table className="w-full text-sm text-left text-[#1F2937]">
              <thead className="bg-[#F9FAFB] text-sm uppercase tracking-wider text-gray-500 border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-5 font-bold">Nome</th>
                  <th className="px-6 py-5 text-center font-bold">Usuário</th>
                  <th className="px-6 py-5 text-center font-bold">Tipo</th>
                  <th className="px-6 py-5 text-center font-bold">Cargo</th>
                  <th className="px-6 py-5 text-center font-bold">Status</th>
                  <th className="px-6 py-5 text-center font-bold">
                    Status da Matrícula
                  </th>
                  <th className="px-6 py-5 text-center font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-gray-950">
                        {u.nome}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600">
                        {u.usuario}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.tipo === "Aluno"
                              ? "bg-blue-50 text-blue-700"
                              : u.tipo === "Professor"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {u.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-gray-500">
                        {u.cargo}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === "Ativo" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-gray-500">
                        {u.statusMatricula}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="text-[#3B82F6] hover:text-[#2563EB] font-bold text-sm"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-gray-400 font-medium"
                    >
                      Nenhum usuário cadastrado atende a esses filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-center items-center gap-2">
            <button className="bg-white border border-[#E5E7EB] w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm text-black shadow-sm">
              1
            </button>
            <button className="bg-white border border-[#E5E7EB] w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-50 shadow-sm">
              2
            </button>
            <button className="bg-white border border-[#E5E7EB] w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-50 shadow-sm">
              3
            </button>
            <button className="bg-white border border-[#E5E7EB] px-3 h-9 flex items-center justify-center rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-50 shadow-sm">
              Próximo
            </button>
          </div>
        </div>
      </main>

      {/* --- MODAL: CRIAR USUÁRIO --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-[550px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-950">
                Criar usuário
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Segmented Control */}
            <div className="bg-[#F3F4F6] p-1.5 rounded-2xl flex gap-1 mb-6">
              {(["Aluno", "Professor", "Administrador"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormTipo(t)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                    formTipo === t
                      ? "bg-white text-gray-900 shadow-sm font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Nome:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Usuário:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Usuário"
                    value={formUsuario}
                    onChange={(e) => setFormUsuario(e.target.value)}
                    className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Senha"
                  value={formSenha}
                  onChange={(e) => setFormSenha(e.target.value)}
                  className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="primeiro_acesso_c"
                  checked={formEditarSenha}
                  onChange={(e) => setFormEditarSenha(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                />
                <label
                  htmlFor="primeiro_acesso_c"
                  className="text-xs text-gray-500 font-medium select-none cursor-pointer"
                >
                  Editar senha no primeiro acesso
                </label>
              </div>

              {formTipo === "Administrador" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Cargo:
                  </label>
                  <div className="relative">
                    <select
                      value={formCargo}
                      onChange={(e) => setFormCargo(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-700 appearance-none"
                    >
                      <option value="Secretário">Secretário</option>
                      <option value="Diretor">Diretor</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-8">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-[#2D3748] hover:bg-[#1A202C] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDITAR USUÁRIO --- */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-[550px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Editar usuário
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Segmented Control */}
            <div className="bg-[#F3F4F6] p-1.5 rounded-2xl flex gap-1 mb-6">
              {(["Aluno", "Professor", "Administrador"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormTipo(t)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                    formTipo === t
                      ? "bg-white text-gray-900 shadow-sm font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleEditUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Nome:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Usuário:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Usuário"
                    value={formUsuario}
                    onChange={(e) => setFormUsuario(e.target.value)}
                    className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  Senha{" "}
                  <span className="text-xs font-normal text-gray-400">
                    (opcional):
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Senha"
                  value={formSenha}
                  onChange={(e) => setFormSenha(e.target.value)}
                  className="border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="primeiro_acesso_e"
                  checked={formEditarSenha}
                  onChange={(e) => setFormEditarSenha(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6] cursor-pointer"
                />
                <label
                  htmlFor="primeiro_acesso_e"
                  className="text-xs text-gray-500 font-medium select-none cursor-pointer"
                >
                  Editar senha no primeiro acesso
                </label>
              </div>

              {formTipo === "Administrador" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Cargo:
                  </label>
                  <div className="relative">
                    <select
                      value={formCargo}
                      onChange={(e) => setFormCargo(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-700 appearance-none"
                    >
                      <option value="Secretário">Secretário</option>
                      <option value="Diretor">Diretor</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              {/* Footer com Ativar à esquerda e Salvar/Cancelar à direita */}
              <div className="flex justify-between items-center pt-5 border-t border-[#E5E7EB] mt-8">
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all ${
                    currentUser.status === "Ativo"
                      ? "bg-[#EF4444] hover:bg-red-600"
                      : "bg-[#3B82F6] hover:bg-[#2563EB]"
                  }`}
                >
                  {currentUser.status === "Ativo" ? "Inativar" : "Ativar"}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-[#2D3748] hover:bg-[#1A202C] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                  >
                    Cancelar
                  </button>
                  <button>
                    type="submit" className="bg-[#10B981] hover:bg-[#059669]
                    text-white font-bold px-6 py-3 rounded-xl text-sm
                    transition-all shadow-sm" Salvar alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
//apagar pra comitar
