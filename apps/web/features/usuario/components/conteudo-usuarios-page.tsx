"use client";

import { useFiltroUrl } from "@/hooks/use-filtro-url";
import { GetUsuariosSchema } from "@repo/types";
import { PesquisaEFiltro } from "@/components/ui/busca/pesquisa-e-filtro";
import { useFiltrosUsuarios } from "../hooks/use-filtros-usuarios";
import { useUsuarios } from "@/features/usuario/hooks/use-usuarios";
import { ModalCriarUsuario } from "./modal-criar-usuario";
import { TabelaUsuarios } from "./tabela-usuarios";

export function ConteudoUsuariosPage() {
  const FILTROS_USUARIOS = useFiltrosUsuarios();
  const { parametros, atualizarParametros } = useFiltroUrl();

  const validarParametros = GetUsuariosSchema.parse({
    ...parametros,
    pagina: parametros.pagina ? Number(parametros.pagina) : 1,
    limite: parametros.limite ? Number(parametros.limite) : 20,
  });

  const { data, isLoading: carregandoUsuarios } =
    useUsuarios(validarParametros);

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-3xl font-medium">Usuários cadastrados</h1>

        <ModalCriarUsuario />
      </div>

      <PesquisaEFiltro
        placeholderPesquisa="Pesquise por usuários"
        camposFiltro={FILTROS_USUARIOS}
      />

      <TabelaUsuarios
        usuarios={
          data
            ? data.dados
            : {
                dados: [],
                meta: {
                  pagina: 1,
                  limite: 20,
                  total: 0,
                  ultima_pagina: 1,
                },
              }
        }
        isLoading={carregandoUsuarios}
        onMudancaPagina={(pagina) => atualizarParametros({ pagina })}
      />
    </>
  );
}
