"use client";

import { useFiltroUrl } from "@/hooks/use-filtro-url";
import { GetTurmasSchema } from "@repo/types";
import { PesquisaEFiltro } from "@/components/ui/busca/pesquisa-e-filtro";
import { useFiltrosTurmas } from "../hooks/use-filtros-turmas";
import { useTurmas } from "../hooks/use-turmas";
import { TabelaTurmas } from "./tabelas/tabela-turmas";
import { ModalCriarTurma } from "./modais/modal-criar-turma";

export function ConteudoTurmasPage() {
  const FILTROS_TURMAS = useFiltrosTurmas();
  const { parametros, atualizarParametros } = useFiltroUrl();

  const validarParametros = GetTurmasSchema.parse({
    ...parametros,
    pagina: parametros.pagina ? Number(parametros.pagina) : 1,
    limite: parametros.limite ? Number(parametros.limite) : 20,
  });

  const { data, isLoading: carregandoTurmas } = useTurmas(validarParametros);

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-3xl font-medium">Turmas cadastradas</h1>

        <ModalCriarTurma />
      </div>

      <PesquisaEFiltro
        placeholderPesquisa="Pesquise por turmas através da identificação ou sala"
        camposFiltro={FILTROS_TURMAS}
      />

      <TabelaTurmas
        turmas={
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
        isLoading={carregandoTurmas}
        onMudancaPagina={(pagina) => atualizarParametros({ pagina })}
      />
    </>
  );
}
