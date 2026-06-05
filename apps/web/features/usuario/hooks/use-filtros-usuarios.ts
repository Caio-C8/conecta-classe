import { useMemo } from "react";
import { ConfigCampoFiltro } from "@/components/ui/busca/filtro";
import {
  GetUsuariosInput,
  Papel,
  Status,
  StatusTrocarSenha,
} from "@repo/types";

export const useFiltrosUsuarios = (): ConfigCampoFiltro<GetUsuariosInput>[] => {
  const filtros = useMemo(() => {
    return [
      {
        nome: "papel",
        label: "Tipo de usuário",
        tipo: "select",
        placeholder: "Selecione o tipo",
        opcoes: [
          { label: "Administrador", value: Papel.ADMINISTRADOR },
          { label: "Professor", value: Papel.PROFESSOR },
          { label: "Aluno", value: Papel.ALUNO },
        ],
      },
      {
        nome: "status",
        label: "Status do usuário",
        tipo: "select",
        placeholder: "Selecione o status",
        opcoes: [
          { label: "Todos", value: Status.TODOS },
          { label: "Ativo", value: Status.ATIVO },
          { label: "Inativo", value: Status.INATIVO },
        ],
      },
      {
        nome: "trocar_senha",
        label: "Estado da senha",
        tipo: "select",
        placeholder: "Selecione o estado",
        opcoes: [
          {
            label: "Todos",
            value: StatusTrocarSenha.TODOS,
          },
          {
            label: "Exige troca",
            value: StatusTrocarSenha.SIM,
          },
          {
            label: "Normal",
            value: StatusTrocarSenha.NAO,
          },
        ],
      },
    ] as ConfigCampoFiltro<GetUsuariosInput>[];
  }, []);

  return filtros;
};
