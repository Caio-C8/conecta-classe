"use client";

import { Tabela } from "@/components/ui/tabela";
import { Paginacao, UsuarioSemSenha } from "@repo/types";
import { COLUNAS_USUARIOS } from "@/features/usuario/constants/colunas-usuarios";

interface TabelaUsuariosProps {
  usuarios: Paginacao<UsuarioSemSenha>;
  isLoading: boolean;
  onMudancaPagina: (pagina: number) => void;
}

export function TabelaUsuarios({
  usuarios,
  isLoading,
  onMudancaPagina,
}: TabelaUsuariosProps) {
  const mostrarTabela = isLoading || (usuarios && usuarios.dados.length > 0);

  if (!mostrarTabela) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-muted/30 border border-dashed rounded-lg text-muted-foreground w-full max-w-7xl mt-6">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full">
      <Tabela
        colunas={COLUNAS_USUARIOS}
        dados={usuarios.dados}
        carregando={isLoading}
        metadados={{
          pagina: usuarios.meta.pagina ? Number(usuarios.meta.pagina) : 1,
          limite: usuarios?.meta.limite ? Number(usuarios.meta.limite) : 20,
          total: usuarios?.meta.total ? Number(usuarios.meta.total) : 0,
          ultimaPagina: usuarios?.meta.ultima_pagina
            ? Number(usuarios.meta.ultima_pagina)
            : 1,
        }}
        onMudancaPagina={onMudancaPagina}
        obterChaveLinha={(usuario) => usuario.id}
      />
    </div>
  );
}
