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
import { useDesvincularAluno } from "../hooks/use-turmas";
import { VincularEDesvincularAlunoInput } from "@repo/types";

interface BotaoDesvincularAlunoProps {
  id: number;
  dados: VincularEDesvincularAlunoInput;
}

export function BotaoDesvincularAluno({
  id,
  dados,
}: BotaoDesvincularAlunoProps) {
  const { mutate: desvincularAluno } = useDesvincularAluno();

  const handleDesvincular = () => {
    desvincularAluno({ id, dados });
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
          <AlertDialogTitle>Desvincular Aluno</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja desvincular o aluno desta turma?
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
