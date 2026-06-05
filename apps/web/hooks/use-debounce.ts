import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, atraso: number): T {
  const [valorDebounced, setValorDebounced] = useState<T>(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDebounced(valor);
    }, atraso);

    return () => clearTimeout(temporizador);
  }, [valor, atraso]);

  return valorDebounced;
}
