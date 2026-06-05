"use client";

import { Button } from "@/components/ui/button";
import { TabelaDisciplinas } from "@/components/ui/tabelas/tabela-disciplinas";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { ModalCriarDisciplina } from "@/components/ui/modais/criar/moda-criar-disciplina";

export function ConteudoPage() {
  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-3xl">Disciplinas cadastradas</h1>

        <ModalCriarDisciplina />
      </div>

      <TabelaDisciplinas />
    </>
  );
}
