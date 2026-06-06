"use client";

import { Tabela } from "@/components/ui/tabela";
import { UsuarioSemSenha } from "@repo/types";
import { COLUNAS_DETALHES_USUARIO } from "../constants/colunas-detalhes-usuario";

interface TabelaDetalhesUsuarioProps {
  usuario: UsuarioSemSenha;
  isLoading: boolean;
}

export function TabelaDetalhesUsuario({
  usuario,
  isLoading,
}: TabelaDetalhesUsuarioProps) {
  const mostrarTabela = isLoading || usuario;

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
        colunas={COLUNAS_DETALHES_USUARIO}
        dados={usuario ? [usuario] : []}
        carregando={isLoading}
        metadados={{
          pagina: 0,
          limite: 1,
          total: 0,
          ultimaPagina: 0,
        }}
        obterChaveLinha={(usuario) => usuario.id}
      />
    </div>
  );
}
