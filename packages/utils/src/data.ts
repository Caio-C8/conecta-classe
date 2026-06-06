export function formatarData(dataStr: string | Date): string {
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatarDiaMes(dataStr: string | Date): {
  dia: string;
  mes: string;
} {
  const data = new Date(dataStr);
  return {
    dia: data.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" }),
    mes: data
      .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
      .toUpperCase()
      .replace(".", ""),
  };
}
