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
import { useRetomarTurma } from "../hooks/use-turmas";
import { ArchiveRestore } from "lucide-react";

export function BotaoRetomarTurma({ id }: { id: number }) {
  const retomarTurma = useRetomarTurma();

  const handleRetomar = () => {
    retomarTurma.mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
        >
          <ArchiveRestore />
          Retomar turma
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retomar Turma</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja Retomar esta turma?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleRetomar}>Retomar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
