import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coluna } from "@/components/ui/tabela";
import { Papel, UsuarioSemSenha } from "@repo/types";
import Link from "next/link";
import { ModalEditarUsuario } from "../components/modal-editar-usuario";

export const COLUNAS_USUARIOS: Coluna<UsuarioSemSenha>[] = [
  {
    cabecalho: "Nome",
    celula: (usuario) => usuario.nome,
  },
  {
    cabecalho: "Usuário",
    celula: (usuario) => usuario.usuario,
  },
  {
    cabecalho: "Tipo",
    celula: (usuario) =>
      usuario.papel.charAt(0).toUpperCase() +
      usuario.papel.slice(1).toLowerCase(),
  },
  {
    cabecalho: "Estado da senha",
    celula: (usuario) => (usuario.trocar_senha ? "Exige troca" : "Normal"),
  },
  {
    cabecalho: "Status",
    celula: (usuario) => {
      return usuario.deleted_at ? (
        <Badge variant="destructive" className="text-sm">
          Inativo
        </Badge>
      ) : (
        <Badge variant="success" className="text-sm">
          Ativo
        </Badge>
      );
    },
  },
  {
    cabecalho: "",
    celula: (usuario) => (
      <div className="flex justify-around">
        <ModalEditarUsuario usuario={usuario} />

        {usuario.papel === Papel.ADMINISTRADOR ? (
          <></>
        ) : (
          <Link href={`/admin/usuarios/${usuario.id}`}>
            <Button variant="link" className="link cursor-pointer">
              Ver mais
            </Button>
          </Link>
        )}
      </div>
    ),
  },
];
