export interface Usuario {
  id: number;
  usuario: string;
  senha: string;
  nome: string;
  nome_search: string;
  papel: Papel;
  trocar_senha: boolean;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const Papel = {
  ALUNO: "ALUNO",
  PROFESSOR: "PROFESSOR",
  ADMINISTRADOR: "ADMINISTRADOR",
} as const;

export type Papel = (typeof Papel)[keyof typeof Papel];
