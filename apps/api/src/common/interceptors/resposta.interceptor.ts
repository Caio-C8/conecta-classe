import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MENSAGEM_RESPOSTA_KEY } from "../decorators/mensagem-resposta.decorator";

export interface Resposta<T> {
  status: number;
  sucesso: boolean;
  mensagem: string;
  dados: T;
}

@Injectable()
export class RespostaInterceptor<T> implements NestInterceptor<T, Resposta<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Resposta<T>> {
    return next.handle().pipe(
      map((dados) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const codigoStatus = response.statusCode;

        const mensagemDecorator = this.reflector.get<string>(
          MENSAGEM_RESPOSTA_KEY,
          context.getHandler(),
        );

        const mensagemFinal =
          mensagemDecorator ||
          dados?.mensagem ||
          "Operação realizada com sucesso";

        return {
          status: codigoStatus,
          sucesso: true,
          mensagem: mensagemFinal,
          dados: dados?.resultado || dados,
        };
      }),
    );
  }
}
