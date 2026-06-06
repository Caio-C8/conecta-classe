"use client";

import { Button } from "@/components/ui/button";
import { Filter as FunnelIcon } from "lucide-react";

interface BotaoToggleFiltroProps {
  onClick: () => void;
  isAtivo?: boolean;
}

export function BotaoToggleFiltro({
  onClick,
  isAtivo,
}: BotaoToggleFiltroProps) {
  return (
    <Button
      type="button"
      variant={isAtivo ? "default" : "outline"}
      size="icon"
      onClick={onClick}
      title="Filtros avançados"
      className="h-10 w-10 shrink-0 cursor-pointer"
    >
      <FunnelIcon className="h-5 w-5" />
    </Button>
  );
}
