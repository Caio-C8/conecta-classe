"use client";

import { useParams } from "next/navigation";
import { useTurma } from "../hooks/use-turmas";
import { ModalEditarTurma } from "./modais/modal-editar-turma";
import { TabelaDetalhesTurma } from "./tabelas/tabela-detalhes-turma";
import { BotaoRetomarTurma } from "./botoes/botao-retomar-turma";
import { BotaoEncerrarTurma } from "./botoes/botao-encerrar-turma";
import { SituacaoTurma } from "@repo/types";
import { TabelaAlunosTurma } from "./tabelas/tabela-alunos-turma";
import { TabelaProfessoresTurma } from "./tabelas/tabela-professores-turma";
import { ModalVincularAluno } from "./modais/modal-vincular-aluno";
import { ModalVincularProfessor } from "./modais/modal-vincular-professor";

export function ConteudoDetalhesTurma() {
  const params = useParams();
  const id = Number(params.id);

  const { data: resposta, isLoading } = useTurma(id);
  const turma = resposta?.dados;

  if (isLoading) {
    return (
      <div className="flex w-full h-[50vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Carregando dados da turma...
        </p>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="flex w-full h-[50vh] items-center justify-center">
        <p className="text-destructive font-medium">Turma não encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-10 w-full items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4 ">
          <h2 className="text-3xl font-semibold tracking-tight">
            Gerenciar Turma
          </h2>

          <div className="flex flex-wrap gap-3">
            {turma.situacao === SituacaoTurma.ENCERRADA ? (
              <BotaoRetomarTurma id={turma.id} />
            ) : (
              <BotaoEncerrarTurma id={turma.id} />
            )}

            <ModalEditarTurma turma={turma} estiloTrigger="button" />
          </div>
        </div>

        <TabelaDetalhesTurma turma={turma} isLoading={isLoading} />
      </section>

      <hr className="border-t border-border/60" />

      <section className="flex flex-col gap-4 gap-10 w-full items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Alunos Matriculados
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os alunos vinculados a esta turma.
            </p>
          </div>

          <ModalVincularAluno turmaId={turma.id} />
        </div>

        <TabelaAlunosTurma
          matriculas={turma.matriculas ?? []}
          isLoading={isLoading}
        />
      </section>

      <hr className="border-t border-border/60" />

      <section className="flex flex-col gap-4 gap-10 w-full items-center">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Professores Responsáveis
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Atribua professores e suas respectivas disciplinas.
            </p>
          </div>

          <ModalVincularProfessor turmaId={turma.id} />
        </div>

        <TabelaProfessoresTurma
          professores={turma.professores ?? []}
          isLoading={isLoading}
        />
      </section>
    </>
  );
}
