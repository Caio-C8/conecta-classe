import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

interface Erro {
  campo: string;
  mensagem: string;
}

interface RespostaErro {
  status: number;
  sucesso: boolean;
  mensagem: string;
  erros: Erro[] | null;
}

@Catch()
export class ExcecaoHttp implements ExceptionFilter {
  private readonly logger = new Logger(ExcecaoHttp.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let codigoStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let mensagem = "Erro interno no servidor.";
    let erros: Erro[] | null = null;

    if (exception instanceof ZodValidationException) {
      codigoStatus = HttpStatus.BAD_REQUEST;
      mensagem = "Erro de validação nos campos informados.";

      const zodErro = exception.getZodError() as ZodError;

      erros = zodErro.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      }));
    } else if (exception instanceof HttpException) {
      codigoStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === "string") {
        mensagem = exceptionResponse;
      } else {
        mensagem =
          exceptionResponse.message ||
          exceptionResponse.error ||
          "Erro na requisição.";

        if (exceptionResponse.erros) {
          erros = exceptionResponse.erros;
        }
      }
    } else if (exception instanceof Error) {
      mensagem = exception.message;
    }

    const erroBody: RespostaErro = {
      status: codigoStatus,
      sucesso: false,
      mensagem,
      erros: erros && erros.length > 0 ? erros : null,
    };

    if (codigoStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception instanceof Error ? exception.message : ""}`,
        exception instanceof Error ? exception.stack : "",
      );
    }

    response.status(codigoStatus).json(erroBody);
  }
}
