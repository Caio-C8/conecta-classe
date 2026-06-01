import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export function setApiFormErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
) {
  const dadosErro = error?.response?.data;

  if (dadosErro?.erros && Array.isArray(dadosErro.erros)) {
    dadosErro.erros.forEach((err: { campo: string; mensagem: string }) => {
      setError(err.campo as Path<T>, {
        type: "server",
        message: err.mensagem,
      });
    });
  }
}
