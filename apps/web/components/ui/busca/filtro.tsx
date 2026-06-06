"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFiltroUrl } from "@/hooks/use-filtro-url";
import { useDebounce } from "@/hooks/use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export type TipoCampoFiltro = "text" | "number" | "date" | "select";

export interface ConfigCampoFiltro<T> {
  nome: keyof T;
  label: string;
  tipo: TipoCampoFiltro;
  placeholder?: string;
  opcoes?: { label: string; value: string }[];
}

interface FiltroProps<T> {
  campos: ConfigCampoFiltro<T>[];
}

export function Filtro<T extends Record<string, any>>({
  campos,
}: FiltroProps<T>) {
  const { atualizarParametros, parametros } = useFiltroUrl();
  const isMontagemInicial = useRef(true);

  const valoresIniciais = useMemo(() => {
    const estado: Record<string, string> = {};
    campos.forEach((campo) => {
      const nomeChave = String(campo.nome);
      estado[nomeChave] = parametros[nomeChave] || "";
    });
    return estado;
  }, [campos, parametros]);

  const [valores, setValores] =
    useState<Record<string, string>>(valoresIniciais);
  const valoresDebounced = useDebounce(valores, 500);

  useEffect(() => {
    if (isMontagemInicial.current) {
      isMontagemInicial.current = false;
      return;
    }

    const filtrosAtivos: Record<string, string> = {};
    let temMudanca = false;

    campos.forEach((campo) => {
      const chave = String(campo.nome);
      const valorFormatado = valoresDebounced[chave]
        ? String(valoresDebounced[chave])
        : "";

      filtrosAtivos[chave] = valorFormatado;

      const valorNaUrl = parametros[chave] || "";
      if (valorFormatado !== valorNaUrl) {
        temMudanca = true;
      }
    });

    if (temMudanca) {
      atualizarParametros(filtrosAtivos);
    }
  }, [valoresDebounced, atualizarParametros, parametros, campos]);

  const handleChange = (nome: string, valor: string) => {
    setValores((prev) => ({ ...prev, [nome]: valor }));
  };

  const handleLimpar = () => {
    const valoresResetados: Record<string, string> = {};
    campos.forEach((campo) => {
      valoresResetados[String(campo.nome)] = "";
    });
    setValores(valoresResetados);
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {campos.map((campo) => {
          const nomeCampo = String(campo.nome);
          const valorAtual = valores[nomeCampo] || "";

          return (
            <div key={nomeCampo} className="flex flex-col space-y-2">
              <Label
                htmlFor={nomeCampo}
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                {campo.label}
              </Label>

              {campo.tipo === "select" ? (
                <Select
                  value={valorAtual}
                  onValueChange={(valor) => handleChange(nomeCampo, valor)}
                >
                  <SelectTrigger id={nomeCampo} className="w-full">
                    <SelectValue placeholder={campo.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {campo.opcoes?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={nomeCampo}
                  type={
                    campo.tipo === "date"
                      ? "date"
                      : campo.tipo === "number"
                        ? "number"
                        : "text"
                  }
                  placeholder={campo.placeholder}
                  value={valorAtual}
                  onChange={(e) => handleChange(nomeCampo, e.target.value)}
                  onWheel={(e) => {
                    if (campo.tipo === "number") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLimpar}
          className="cursor-pointer"
        >
          <X className="mr-2 h-4 w-4" /> Limpar
        </Button>
      </div>
    </div>
  );
}
