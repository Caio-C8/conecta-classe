import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PersistenceModule } from "./common/prisma/prisma.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { RespostaInterceptor } from "./common/interceptors/resposta.interceptor";
import { ExcecaoHttp } from "./common/filters/excecao-http.filter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PersistenceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: RespostaInterceptor },
    { provide: APP_FILTER, useClass: ExcecaoHttp },
  ],
})
export class AppModule {}
