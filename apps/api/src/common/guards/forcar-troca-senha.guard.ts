import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLICO_KEY } from "../decorators/publico.decorator";
import { IGNORAR_TROCA_SENHA_KEY } from "../decorators/ignorar-troca-senha.decorator";

@Injectable()
export class ForcarTrocaSenhaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLICO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const ignorarTroca = this.reflector.getAllAndOverride<boolean>(
      IGNORAR_TROCA_SENHA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (ignorarTroca) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuarioLogado = request.user;

    if (usuarioLogado && usuarioLogado.trocar_senha) {
      throw new ForbiddenException(
        "Você precisa redefinir sua senha antes de continuar.",
      );
    }

    return true;
  }
}
