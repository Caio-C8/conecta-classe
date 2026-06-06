"use client";

import { useParams } from "next/navigation";
import { useUsuario } from "../hooks/use-usuarios";
import { TabelaDetalhesUsuario } from "./tabela-detalhes-usuario";
import { ModalEditarUsuario } from "./modal-editar-usuario";
import { TabelaMatriculas } from "./tabela-matriculas";
import { Papel } from "@repo/types";
import { TabelaTurmas } from "./tabela-turmas";

export function ConteudoDetalhesUsuariosPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: resposta, isLoading } = useUsuario(id);
  const usuario = resposta?.dados;

  if (isLoading) {
    return (
      <div className="flex w-full h-[50vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Carregando dados do usuário...
        </p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex w-full h-[50vh] items-center justify-center">
        <p className="text-destructive font-medium">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-3xl font-medium">Detalhes do usuário</h1>

        <ModalEditarUsuario usuario={usuario} estiloTrigger="button" />
      </div>

      <TabelaDetalhesUsuario usuario={usuario} isLoading={isLoading} />

      {usuario.papel === Papel.ALUNO && (
        <>
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-medium">Matrículas</h1>
          </div>

          <TabelaMatriculas
            matriculas={usuario.aluno?.matriculas ?? []}
            isLoading={isLoading}
          />
        </>
      )}

      {usuario.papel === Papel.PROFESSOR && (
        <>
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-medium">Turmas</h1>
          </div>

          <TabelaTurmas
            turmas={usuario.professor?.turmas ?? []}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
}
