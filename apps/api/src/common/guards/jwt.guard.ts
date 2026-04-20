import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLICO_KEY } from "../decorators/publico.decorator";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublico = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLICO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublico) {
      return true;
    }

    return super.canActivate(context);
  }
}
