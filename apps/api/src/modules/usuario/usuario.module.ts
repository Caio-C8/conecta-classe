import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { UsuarioRepository } from "./usuario.repository";
import { UsuarioController } from "./usuario.controller";

@Module({
  imports: [],
  providers: [UsuarioService, UsuarioRepository],
  controllers: [UsuarioController],
  exports: [UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}
