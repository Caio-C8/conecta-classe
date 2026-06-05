"use client";

import Link from "next/link";
import { FaBook, FaThLarge, FaUser, FaUserTie } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useResumoAlunos,
  useResumoProfessores,
} from "@/features/usuario/hooks/use-usuarios";
import { useResumoTurmas } from "@/features/turma/hooks/use-turmas";
import { useResumoDisciplinas } from "@/features/disciplina/hooks/use-disciplinas";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ModalCriarUsuario } from "@/features/usuario/components/modal-criar-usuario";
import { ModalCriarTurma } from "@/features/turma/components/modal-criar-turma";
import { ModalCriarDisciplina } from "@/features/disciplina/components/moda-criar-disciplina";

export function ConteudoHomeAdmin() {
  const [nomeUsuario, setNomeUsuario] = useState<string>("Carregando...");

  const { data: reqAlunos, isLoading: loadAlunos } = useResumoAlunos();
  const { data: reqProfessores, isLoading: loadProfessores } =
    useResumoProfessores();
  const { data: reqTurmas, isLoading: loadTurmas } = useResumoTurmas();
  const { data: reqDisciplinas, isLoading: loadDisciplinas } =
    useResumoDisciplinas();

  useEffect(() => {
    const nomeSalvo = Cookies.get("nome");
    setNomeUsuario(nomeSalvo || "Administrador");
  }, []);

  const exibirValor = (isLoading: boolean, valor?: number) => {
    if (isLoading) {
      return (
        <span className="animate-pulse text-muted-foreground/50">...</span>
      );
    }
    return valor ?? 0;
  };

  return (
    <>
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-medium">Olá, {nomeUsuario}!</h1>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl shadow-md border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Alunos Cursando
            </CardTitle>
            <FaUser className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-3xl font-semibold">
              {exibirValor(loadAlunos, reqAlunos?.dados.quantidade)}
            </div>
            <Link
              href="/admin/usuarios?papel=ALUNO&status=ATIVO"
              className="text-sm text-blue-600 hover:underline"
            >
              Ver detalhes
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Professores Ativos
            </CardTitle>
            <FaUserTie className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-3xl font-semibold">
              {exibirValor(loadProfessores, reqProfessores?.dados.quantidade)}
            </div>
            <Link
              href="/admin/usuarios?papel=PROFESSOR&status=ATIVO"
              className="text-sm text-blue-600 hover:underline"
            >
              Ver detalhes
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Turmas Em Andamento
            </CardTitle>
            <FaThLarge className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-3xl font-semibold">
              {exibirValor(loadTurmas, reqTurmas?.dados.quantidade)}
            </div>
            <Link
              href="/admin/turmas?status=ATIVO"
              className="text-sm text-blue-600 hover:underline"
            >
              Ver detalhes
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Disciplinas Cadastradas
            </CardTitle>
            <FaBook className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-3xl font-semibold">
              {exibirValor(loadDisciplinas, reqDisciplinas?.dados.quantidade)}
            </div>
            <Link
              href="/admin/disciplinas?status=ATIVO"
              className="text-sm text-blue-600 hover:underline"
            >
              Ver detalhes
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-medium">Atalhos Rápidos</h2>

        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <ModalCriarUsuario redirecionar={true} />

            <ModalCriarTurma redirecionar={true} />

            <ModalCriarDisciplina redirecionar={true} />
          </div>
        </div>
      </section>
    </>
  );
}
