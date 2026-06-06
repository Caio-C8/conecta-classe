"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useUsuarios } from "@/features/usuario/hooks/use-usuarios";
import { useVincularAluno } from "@/features/turma/hooks/use-turmas";
import { GetUsuariosSchema, Papel, Status } from "@repo/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";

interface ModalVincularAlunoProps {
  turmaId: number;
}

export function ModalVincularAluno({ turmaId }: ModalVincularAlunoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<number | null>(
    null,
  );
  const [alunoSelecionadoNome, setAlunoSelecionadoNome] = useState<string>("");

  const pesquisaDebounced = useDebounce(pesquisa, 500);

  const parametros = GetUsuariosSchema.parse({
    pesquisa: pesquisaDebounced,
    papel: Papel.ALUNO,
    status: Status.ATIVO,
    pagina: 1,
    limite: 10,
  });

  const { data: respostaUsuarios, isLoading: isBuscandoUsuarios } =
    useUsuarios(parametros);

  const usuarios = respostaUsuarios?.dados.dados || [];

  const { mutate: vincularAluno, isPending: isVinculando } = useVincularAluno();

  const handleLimpar = () => {
    setPesquisa("");
    setAlunoSelecionadoId(null);
    setAlunoSelecionadoNome("");
  };

  const handleClose = () => {
    handleLimpar();
    setIsModalOpen(false);
  };

  const handleVincular = () => {
    if (!alunoSelecionadoId) return;

    vincularAluno(
      {
        id: turmaId,
        dados: { alunoId: alunoSelecionadoId },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) handleLimpar();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3580E9] hover:bg-[#3580E9]/90 text-white px-6 py-6 text-base cursor-pointer"
        >
          <FaPlus />
          Vincular aluno
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Vincular alunos
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Field>
            <FieldLabel>Pesquise pelo aluno:</FieldLabel>

            <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxOpen}
                  className="w-full justify-between font-normal text-[16px] sm:text-sm bg-card h-10 border-border"
                >
                  {alunoSelecionadoNome
                    ? alunoSelecionadoNome
                    : "Nome do aluno..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar aluno..."
                    value={pesquisa}
                    onValueChange={setPesquisa}
                  />
                  <CommandList>
                    {isBuscandoUsuarios ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando usuários...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
                        <CommandGroup>
                          {usuarios.map((usuario) => (
                            <CommandItem
                              key={usuario.aluno?.id}
                              value={usuario.nome}
                              onSelect={() => {
                                setAlunoSelecionadoId(
                                  usuario.aluno?.id || null,
                                );
                                setAlunoSelecionadoNome(usuario.nome);
                                setIsComboboxOpen(false);
                              }}
                              className="cursor-pointer bg-transparent! hover:bg-muted/40!"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  alunoSelecionadoId === usuario.aluno?.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {usuario.nome}
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({usuario.usuario})
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        <hr className="my-2 border-t border-border" />

        <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
            disabled={isVinculando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleVincular}
            disabled={!alunoSelecionadoId || isVinculando}
            className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full sm:w-auto"
          >
            {isVinculando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vinculando...
              </>
            ) : (
              "Vincular"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
