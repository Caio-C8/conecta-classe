import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AutenticacaoController } from "./autenticacao.controller";
import { AutenticacaoService } from "./autenticacao.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsuarioModule } from "../usuario/usuario.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    UsuarioModule,
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService, JwtStrategy],
  exports: [AutenticacaoService],
})
export class AutenticacaoModule {}
