import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PersistenceModule } from "./common/prisma/prisma.module";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { RespostaInterceptor } from "./common/interceptors/resposta.interceptor";
import { ExcecaoHttp } from "./common/filters/excecao-http.filter";
import { JwtGuard } from "./common/guards/jwt.guard";
import { AutenticacaoModule } from "./modules/autenticacao/autenticacao.module";
import { PapeisGuard } from "./common/guards/papeis.guard";
import { ForcarTrocaSenhaGuard } from "./common/guards/forcar-troca-senha.guard";
import { ZodValidationPipe } from "nestjs-zod";
import { UsuarioModule } from "./modules/usuario/usuario.module";
import { MatriculaModule } from "./modules/matricula/matricula.module";
import { AulaModule } from "./modules/aula/aula.module";
import { DisciplinaModule } from "./modules/disciplina/disciplina.module";
import { FrequenciaModule } from "./modules/frequencia/frequencia.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PersistenceModule,
    AutenticacaoModule,
    UsuarioModule,
    FrequenciaModule,
    MatriculaModule,
    AulaModule,
    DisciplinaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: RespostaInterceptor },
    { provide: APP_FILTER, useClass: ExcecaoHttp },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: ForcarTrocaSenhaGuard },
    { provide: APP_GUARD, useClass: PapeisGuard },
  ],
})
export class AppModule {}
