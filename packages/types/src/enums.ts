export const StatusMatricula = {
  CURSANDO: "CURSANDO",
  APROVADO: "APROVADO",
  REPROVADO: "REPROVADO",
  TRANSFERIDO: "TRANSFERIDO",
} as const;
export type StatusMatricula =
  (typeof StatusMatricula)[keyof typeof StatusMatricula];

export const Papel = {
  ALUNO: "ALUNO",
  PROFESSOR: "PROFESSOR",
  ADMINISTRADOR: "ADMINISTRADOR",
} as const;
export type Papel = (typeof Papel)[keyof typeof Papel];

export const Cargo = {
  DIRETORA: "DIRETORA",
  SECRETARIA: "SECRETARIA",
} as const;
export type Cargo = (typeof Cargo)[keyof typeof Cargo];

export const TipoEvento = {
  ATIVIDADE: "ATIVIDADE",
  AVISO: "AVISO",
  GERAL: "GERAL",
  PROVA: "PROVA",
} as const;
export type TipoEvento = (typeof TipoEvento)[keyof typeof TipoEvento];

export const NivelEnsino = {
  FUNDAMENTAL_1: "FUNDAMENTAL_1",
  FUNDAMENTAL_2: "FUNDAMENTAL_2",
  MEDIO: "MEDIO",
} as const;
export type NivelEnsino = (typeof NivelEnsino)[keyof typeof NivelEnsino];

export const SituacaoRendimento = {
  APROVADO: "APROVADO",
  REPROVADO_POR_NOTA: "REPROVADO_POR_NOTA",
  REPROVADO_POR_FALTA: "REPROVADO_POR_FALTA",
  TRANSFERIDO: "TRANSFERIDO",
  CURSANDO: "CURSANDO",
} as const;
export type SituacaoRendimento =
  (typeof SituacaoRendimento)[keyof typeof SituacaoRendimento];

export const SituacaoTurma = {
  EM_ANDAMENTO: "EM_ANDAMENTO",
  ENCERRADA: "ENCERRADA",
} as const;
export type SituacaoTurma = (typeof SituacaoTurma)[keyof typeof SituacaoTurma];

export const StatusUsuario = {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
  TODOS: "TODOS",
} as const;
export type StatusUsuario = (typeof StatusUsuario)[keyof typeof StatusUsuario];

export const StatusTrocarSenha = {
  SIM: "SIM",
  NAO: "NAO",
  TODOS: "TODOS",
} as const;
export type StatusTrocarSenha =
  (typeof StatusTrocarSenha)[keyof typeof StatusTrocarSenha];
