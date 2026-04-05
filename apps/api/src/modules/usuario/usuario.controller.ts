import { Body, Controller, Post } from "@nestjs/common";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { CreateUsuarioDto } from "./dtos/create-usuario.dto";
import { Papel, Usuario } from "@repo/types";
import { UsuarioService } from "./usuario.service";
import { Papeis } from "src/common/decorators/papeis.decorator";

@Controller("usuarios")
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Usuário criado com sucesso.")
  async criarUsuario(@Body() dados: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createUsuario(dados);
  }
}
