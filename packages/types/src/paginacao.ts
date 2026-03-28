import { z } from "zod";

export interface Paginacao<T> {
  dados: T[];
  meta: {
    total: number;
    pagina: number;
    ultima_pagina: number;
    limite: number;
  };
}

export const PaginacaoSchema = z.object({
  pagina: z.coerce.number().gte(1).optional().default(1),
  limite: z.coerce.number().gte(1).optional().default(20),
});

export type PaginacaoInput = z.infer<typeof PaginacaoSchema>;
