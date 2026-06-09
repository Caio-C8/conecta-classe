import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  // 1. Cria a instância da aplicação primeiro (isso inicializa o ConfigModule)
  const app = await NestFactory.create(AppModule);

  // 2. Extrai o ConfigService de dentro da aplicação rodando
  const configService = app.get(ConfigService);

  // 3. Lê as variáveis com segurança
  const urlFrontend = configService.get<string>("URL_FRONTEND_CORS");

  // 4. Habilita o CORS com a variável já carregada do .env
  app.enableCors({
    origin: urlFrontend,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // 5. Inicia o servidor
  await app.listen(3001);
}
bootstrap();
