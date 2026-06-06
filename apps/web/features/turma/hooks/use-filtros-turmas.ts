import { useMemo } from "react";
import { ConfigCampoFiltro } from "@/components/ui/busca/filtro";
import {
  GetTurmasInput,
  NivelEnsino,
  SituacaoTurma,
  Status,
} from "@repo/types";

export const useFiltrosTurmas = (): ConfigCampoFiltro<GetTurmasInput>[] => {
  const filtros = useMemo(() => {
    return [
      {
        nome: "status",
        label: "Status da Turma",
        tipo: "select",
        placeholder: "Selecione o status",
        opcoes: [
          { label: "Todos", value: Status.TODOS },
          { label: "Ativos", value: Status.ATIVO },
          { label: "Inativos", value: Status.INATIVO },
        ],
      },
      {
        nome: "situacao",
        label: "Situação da Turma",
        tipo: "select",
        placeholder: "Selecione a situação",
        opcoes: [
          { label: "Em andamento", value: SituacaoTurma.EM_ANDAMENTO },
          { label: "Encerrada", value: SituacaoTurma.ENCERRADA },
        ],
      },
      {
        nome: "nivel_ensino",
        label: "Nível de Ensino",
        tipo: "select",
        placeholder: "Selecione o nível de ensino",
        opcoes: [
          { label: "Fundamental I", value: NivelEnsino.FUNDAMENTAL_1 },
          { label: "Fundamental II", value: NivelEnsino.FUNDAMENTAL_2 },
          { label: "Ensino Médio", value: NivelEnsino.MEDIO },
        ],
      },
      {
        nome: "serie",
        label: "Série",
        tipo: "number",
        placeholder: "Ex: 1, 9",
      },
      {
        nome: "ano_letivo",
        label: "Ano Letivo",
        tipo: "number",
        placeholder: "Ex: 2024",
      },
    ] as ConfigCampoFiltro<GetTurmasInput>[];
  }, []);

  return filtros;
};
