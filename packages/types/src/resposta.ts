export interface Resposta<T> {
  status: number;
  sucesso: boolean;
  mensagem: string;
  dados: T;
}
