import { TabelaDisciplinas } from "@/components/ui/tabelas/tabela-disciplinas";

export default function DisciplinasPage() {
  return (
    <div className="flex flex-col gap-10 overflow-y-auto items-center w-full">
      <h1 className="text-4xl font-bold text-center">Disciplinas</h1>
      <TabelaDisciplinas />
    </div>
  );
}
