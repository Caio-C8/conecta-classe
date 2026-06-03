import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface EsqueletoTabelaProps {
  quantidadeColunas: number;
  quantidadeLinhas?: number;
}

export function EsqueletoTabela({
  quantidadeColunas,
  quantidadeLinhas = 10,
}: EsqueletoTabelaProps) {
  return (
    <>
      {Array.from({ length: quantidadeLinhas }).map((_, indiceLinha) => (
        <TableRow key={indiceLinha} className="h-[50px]">
          {Array.from({ length: quantidadeColunas }).map((_, indiceColuna) => (
            <TableCell key={indiceColuna}>
              <Skeleton className="h-4 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
