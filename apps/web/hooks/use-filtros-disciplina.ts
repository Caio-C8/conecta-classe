import { useMemo } from "react";
import { ConfigCampoFiltro } from "@/components/ui/filtro";
import { GetDisciplinasInput, Status } from "@repo/types";

export const useFiltrosDisciplinas =
  (): ConfigCampoFiltro<GetDisciplinasInput>[] => {
    const filtros = useMemo(() => {
      return [
        {
          nome: "status",
          label: "Status da Disciplina",
          tipo: "select",
          placeholder: "Selecione o status",
          opcoes: [
            { label: "Todos", value: Status.TODOS },
            { label: "Ativos", value: Status.ATIVO },
            { label: "Inativos", value: Status.INATIVO },
          ],
        },
      ] as ConfigCampoFiltro<GetDisciplinasInput>[];
    }, []);

    return filtros;
  };
