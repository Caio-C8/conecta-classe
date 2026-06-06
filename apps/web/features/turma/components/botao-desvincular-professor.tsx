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
import { useDesvincularProfessor } from "../hooks/use-turmas";
import { VincularEDesvincularProfessorInput } from "@repo/types";

interface BotaoDesvincularProfessorProps {
  id: number;
  dados: VincularEDesvincularProfessorInput;
}

export function BotaoDesvincularProfessor({
  id,
  dados,
}: BotaoDesvincularProfessorProps) {
  const { mutate: desvincularProfessor } = useDesvincularProfessor();

  const handleDesvincular = () => {
    desvincularProfessor({ id, dados });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="link">
          Desvincular
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desvincular Professor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja desvincular o professor desta turma?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDesvincular}>
            Desvincular
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
