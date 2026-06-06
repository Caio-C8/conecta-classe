"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useUsuarios } from "@/features/usuario/hooks/use-usuarios";
import { useDisciplinas } from "@/features/disciplina/hooks/use-disciplinas";
import { useVincularProfessor } from "@/features/turma/hooks/use-turmas";
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

interface ModalVincularProfessorProps {
  turmaId: number;
}

export function ModalVincularProfessor({
  turmaId,
}: ModalVincularProfessorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isComboboxProfessorOpen, setIsComboboxProfessorOpen] = useState(false);
  const [pesquisaProfessor, setPesquisaProfessor] = useState("");
  const [professorSelecionadoId, setProfessorSelecionadoId] = useState<
    number | null
  >(null);
  const [professorSelecionadoNome, setProfessorSelecionadoNome] =
    useState<string>("");
  const pesquisaProfessorDebounced = useDebounce(pesquisaProfessor, 500);

  const [isComboboxDisciplinaOpen, setIsComboboxDisciplinaOpen] =
    useState(false);
  const [pesquisaDisciplina, setPesquisaDisciplina] = useState("");
  const [disciplinaSelecionadaId, setDisciplinaSelecionadaId] = useState<
    number | null
  >(null);
  const [disciplinaSelecionadaNome, setDisciplinaSelecionadaNome] =
    useState<string>("");
  const pesquisaDisciplinaDebounced = useDebounce(pesquisaDisciplina, 500);

  const parametrosProfessor = GetUsuariosSchema.parse({
    pesquisa: pesquisaProfessorDebounced,
    papel: Papel.PROFESSOR,
    status: Status.ATIVO,
    pagina: 1,
    limite: 10,
  });

  const { data: respostaUsuarios, isLoading: isBuscandoProfessores } =
    useUsuarios(parametrosProfessor);
  const professores = respostaUsuarios?.dados.dados || [];

  const { data: respostaDisciplinas, isLoading: isBuscandoDisciplinas } =
    useDisciplinas({
      pesquisa: pesquisaDisciplinaDebounced,
      status: Status.ATIVO,
      pagina: 1,
      limite: 10,
    });
  const disciplinas = respostaDisciplinas?.dados.dados || [];

  const { mutate: vincularProfessor, isPending: isVinculando } =
    useVincularProfessor();

  const handleLimpar = () => {
    setPesquisaProfessor("");
    setProfessorSelecionadoId(null);
    setProfessorSelecionadoNome("");

    setPesquisaDisciplina("");
    setDisciplinaSelecionadaId(null);
    setDisciplinaSelecionadaNome("");
  };

  const handleClose = () => {
    handleLimpar();
    setIsModalOpen(false);
  };

  const handleVincular = () => {
    if (!professorSelecionadoId || !disciplinaSelecionadaId) return;

    vincularProfessor(
      {
        id: turmaId,
        dados: {
          professorId: professorSelecionadoId,
          disciplinaId: disciplinaSelecionadaId,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const isFormularioValido = professorSelecionadoId && disciplinaSelecionadaId;

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
          Vincular professor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Vincular professor
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          <Field>
            <FieldLabel>Pesquise pelo professor:</FieldLabel>
            <Popover
              open={isComboboxProfessorOpen}
              onOpenChange={setIsComboboxProfessorOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxProfessorOpen}
                  className="w-full justify-between font-normal text-[16px] sm:text-sm bg-card h-10 border-border"
                >
                  {professorSelecionadoNome
                    ? professorSelecionadoNome
                    : "Nome do professor..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar professor..."
                    value={pesquisaProfessor}
                    onValueChange={setPesquisaProfessor}
                  />
                  <CommandList>
                    {isBuscandoProfessores ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando professores...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>
                          Nenhum professor encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                          {professores.map((usuario) => (
                            <CommandItem
                              key={usuario.professor?.id || usuario.id}
                              value={usuario.nome}
                              onSelect={() => {
                                setProfessorSelecionadoId(
                                  usuario.professor?.id || null,
                                );
                                setProfessorSelecionadoNome(usuario.nome);
                                setIsComboboxProfessorOpen(false);
                              }}
                              className="cursor-pointer bg-transparent! hover:bg-muted/40!"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  professorSelecionadoId ===
                                    usuario.professor?.id
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

          <Field>
            <FieldLabel>Pesquise pela disciplina:</FieldLabel>
            <Popover
              open={isComboboxDisciplinaOpen}
              onOpenChange={setIsComboboxDisciplinaOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxDisciplinaOpen}
                  className="w-full justify-between font-normal text-[16px] sm:text-sm bg-card h-10 border-border"
                >
                  {disciplinaSelecionadaNome
                    ? disciplinaSelecionadaNome
                    : "Nome da disciplina..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar disciplina..."
                    value={pesquisaDisciplina}
                    onValueChange={setPesquisaDisciplina}
                  />
                  <CommandList>
                    {isBuscandoDisciplinas ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando disciplinas...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>
                          Nenhuma disciplina encontrada.
                        </CommandEmpty>
                        <CommandGroup>
                          {disciplinas.map((disciplina) => (
                            <CommandItem
                              key={disciplina.id}
                              value={disciplina.nome}
                              onSelect={() => {
                                setDisciplinaSelecionadaId(disciplina.id);
                                setDisciplinaSelecionadaNome(disciplina.nome);
                                setIsComboboxDisciplinaOpen(false);
                              }}
                              className="cursor-pointer bg-transparent! hover:bg-muted/40!"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  disciplinaSelecionadaId === disciplina.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {disciplina.nome}
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
            disabled={!isFormularioValido || isVinculando}
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
