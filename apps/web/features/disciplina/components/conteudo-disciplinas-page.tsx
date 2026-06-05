"use client";

import { TabelaDisciplinas } from "@/features/disciplina/components/tabela-disciplinas";
import { ModalCriarDisciplina } from "@/features/disciplina/components/moda-criar-disciplina";
import { useFiltroUrl } from "@/hooks/use-filtro-url";
import { GetDisciplinasSchema } from "@repo/types";
import { useDisciplinas } from "@/features/disciplina/hooks/use-disciplinas";
import { PesquisaEFiltro } from "@/components/ui/busca/pesquisa-e-filtro";
import { useFiltrosDisciplinas } from "@/features/disciplina/hooks/use-filtros-disciplina";

export function ConteudoDisciplinasPage() {
  const FILTROS_DISCIPLINAS = useFiltrosDisciplinas();
  const { parametros, atualizarParametros } = useFiltroUrl();

  const validarParametros = GetDisciplinasSchema.parse({
    ...parametros,
    pagina: parametros.pagina ? Number(parametros.pagina) : 1,
    limite: parametros.limite ? Number(parametros.limite) : 20,
  });

  const { data, isLoading: carregandoDisciplinas } =
    useDisciplinas(validarParametros);

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-3xl font-medium">Disciplinas cadastradas</h1>

        <ModalCriarDisciplina />
      </div>

      <PesquisaEFiltro
        placeholderPesquisa="Pesquise por disciplinas"
        camposFiltro={FILTROS_DISCIPLINAS}
      />

      <TabelaDisciplinas
        disciplinas={
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
        isLoading={carregandoDisciplinas}
        onMudancaPagina={(pagina) => atualizarParametros({ pagina })}
      />
    </>
  );
}
