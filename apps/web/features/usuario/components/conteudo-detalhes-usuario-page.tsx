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
      <section className="flex flex-col gap-10 w-full items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Detalhes do usuário
          </h2>

          <div className="flex flex-wrap gap-3">
            <ModalEditarUsuario usuario={usuario} estiloTrigger="button" />
          </div>
        </div>

        <TabelaDetalhesUsuario usuario={usuario} isLoading={isLoading} />
      </section>

      {usuario.papel === Papel.ALUNO && (
        <>
          <hr className="border-t border-border/60" />

          <section className="flex flex-col gap-10 w-full items-center">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Matrículas
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Histórico de turmas e matrículas vinculadas a este aluno.
                </p>
              </div>
            </div>

            <TabelaMatriculas
              matriculas={usuario.aluno?.matriculas ?? []}
              isLoading={isLoading}
            />
          </section>
        </>
      )}

      {usuario.papel === Papel.PROFESSOR && (
        <>
          <hr className="border-t border-border/60" />

          <section className="flex flex-col gap-10 w-full items-center">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Turmas Lecionadas
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Turmas nas quais o professor ministra disciplinas.
                </p>
              </div>
            </div>

            <TabelaTurmas
              turmas={usuario.professor?.turmas ?? []}
              isLoading={isLoading}
            />
          </section>
        </>
      )}
    </>
  );
}
