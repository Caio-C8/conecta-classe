"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginacaoTabelaProps {
  pagina: number;
  ultimaPagina: number;
  onMudancaPagina: (pagina: number) => void;
}

export function PaginacaoTabela({
  pagina,
  ultimaPagina,
  onMudancaPagina,
}: PaginacaoTabelaProps) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pagina > 1) onMudancaPagina(pagina - 1);
            }}
            className={
              pagina <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>

        <PaginationItem>
          <span className="text-sm text-muted-foreground px-4">
            Página {pagina} de {ultimaPagina}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pagina < ultimaPagina) onMudancaPagina(pagina + 1);
            }}
            className={
              pagina >= ultimaPagina
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
