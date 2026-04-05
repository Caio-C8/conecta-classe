import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Papel } from "@repo/types";
import { PAPEL_KEY } from "../decorators/papeis.decorator";

@Injectable()
export class PapeisGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const papeisExigidos = this.reflector.getAllAndOverride<Papel[]>(
      PAPEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!papeisExigidos) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuarioLogado = request.user;

    if (!papeisExigidos.includes(usuarioLogado.papel)) {
      throw new ForbiddenException(
        "Seu perfil não tem permissão para acessar este recurso.",
      );
    }

    return true;
  }
}
