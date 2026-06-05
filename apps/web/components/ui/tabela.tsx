"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginacaoTabela } from "./paginacao-tabela";
import { EsqueletoTabela } from "./esqueleto-tabela";
import { ReactNode } from "react";
import { Card } from "./card";

export interface Coluna<T> {
  cabecalho: string;
  celula: (item: T) => ReactNode;
}

interface TabelaProps<T> {
  colunas: Coluna<T>[];
  dados?: T[];
  carregando?: boolean;
  metadados?: {
    total: number;
    pagina: number;
    limite: number;
    ultimaPagina: number;
  };
  onMudancaPagina?: (pagina: number) => void;
  obterChaveLinha: (item: T) => string | number;
}

export function Tabela<T>({
  colunas,
  dados = [],
  carregando,
  metadados,
  onMudancaPagina,
  obterChaveLinha,
}: TabelaProps<T>) {
  return (
    <Card className="w-full overflow-visible border border-[#E4E4E7] ring-transparent!">
      <Table>
        {metadados && metadados.total > 0 ? (
          <TableCaption className="text-right pr-4">
            {carregando
              ? "Buscando dados..."
              : `${metadados.total} encontrados`}
          </TableCaption>
        ) : (
          <></>
        )}
        <TableHeader>
          <TableRow className="hover:bg-transparent border-[#E4E4E7]">
            {colunas.map((coluna, index) => (
              <TableHead key={index} className="text-center text-base">
                {coluna.cabecalho}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-[#E4E4E7]">
          {carregando ? (
            <EsqueletoTabela
              quantidadeColunas={colunas.length}
              quantidadeLinhas={metadados?.limite}
            />
          ) : (
            dados.map((item) => (
              <TableRow
                key={obterChaveLinha(item)}
                className="h-[60px]  border-[#E4E4E7]"
              >
                {colunas.map((coluna, indiceColuna) => (
                  <TableCell
                    key={indiceColuna}
                    className="text-center text-base"
                  >
                    {coluna.celula(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!carregando &&
        metadados &&
        onMudancaPagina &&
        metadados.ultimaPagina > 1 && (
          <PaginacaoTabela
            pagina={metadados.pagina}
            ultimaPagina={metadados.ultimaPagina}
            onMudancaPagina={onMudancaPagina}
          />
        )}
    </Card>
  );
}
