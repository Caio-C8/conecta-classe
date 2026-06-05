"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useFiltroUrl = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parametros = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const atualizarParametros = useCallback(
    (novosParametros: Record<string, any>) => {
      const parametrosUrl = new URLSearchParams(searchParams.toString());

      Object.entries(novosParametros).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== "") {
          parametrosUrl.set(chave, String(valor));
        } else {
          parametrosUrl.delete(chave);
        }
      });

      const chaves = Object.keys(novosParametros);
      const isApenasPaginacao = chaves.length === 1 && chaves[0] === "pagina";

      if (!isApenasPaginacao) {
        parametrosUrl.set("pagina", "1");
      }

      router.replace(`${pathname}?${parametrosUrl.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return { parametros, atualizarParametros };
};
