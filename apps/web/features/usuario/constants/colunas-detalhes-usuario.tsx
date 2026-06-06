import { Badge } from "@/components/ui/badge";
import { Coluna } from "@/components/ui/tabela";
import { Papel, UsuarioSemSenha } from "@repo/types";

export const COLUNAS_DETALHES_USUARIO: Coluna<UsuarioSemSenha>[] = [
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
    celula: (usuario) => {
      switch (usuario.papel) {
        case Papel.ADMINISTRADOR:
          return "Administrador";
        case Papel.PROFESSOR:
          return "Professor";
        case Papel.ALUNO:
          return "Aluno";
      }
    },
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
];
