import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEncerrarTurma } from "../../hooks/use-turmas";
import { Archive } from "lucide-react";

export function BotaoEncerrarTurma({ id }: { id: number }) {
  const encerrarTurma = useEncerrarTurma();

  const handleEncerrar = () => {
    encerrarTurma.mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#EF4444] hover:bg-[#EF4444]/90 text-white px-6 py-6 text-base cursor-pointer"
        >
          <Archive />
          Encerrar turma
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Encerrar Turma</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja encerrar esta turma?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleEncerrar}>
            Encerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
