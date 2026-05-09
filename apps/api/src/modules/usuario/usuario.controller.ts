import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { MensagemResposta } from "src/common/decorators/mensagem-resposta.decorator";
import { CreateUsuarioDto } from "./dtos/create-usuario.dto";
import { UsuarioService } from "./usuario.service";
import { Papeis } from "src/common/decorators/papeis.decorator";
import { Paginacao, Papel, UsuarioSemSenha } from "@repo/types";
import { GetAllUsuarioDto } from "./dtos/get-all-usuarios.dto";
import { UpdateUsuarioDto } from "./dtos/update-usuario.dto";

@Controller("usuarios")
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Papeis(Papel.ADMINISTRADOR)
  @MensagemResposta("Usuário criado com sucesso.")
  async criarUsuario(
    @Body() dados: CreateUsuarioDto,
  ): Promise<UsuarioSemSenha> {
    return this.usuarioService.createUsuario(dados);
  }

  @Get()
  @Papeis(Papel.ADMINISTRADOR)
  async buscarTodosUsuarios(
    @Query() params: GetAllUsuarioDto,
  ): Promise<Paginacao<UsuarioSemSenha>> {
    return await this.usuarioService.getAllUsuarios(params);
  }

  @Patch("/:id")
  @Papeis(Papel.ADMINISTRADOR)
  async atualizarUsuario(
    @Param("id", ParseIntPipe) id: number,
    @Body() dados: UpdateUsuarioDto,
  ): Promise<UsuarioSemSenha> {
    return await this.usuarioService.updateUsuario(id, dados);
  }

  @Patch("/:id/inativar")
  @Papeis(Papel.ADMINISTRADOR)
  async inativarUsuario(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UsuarioSemSenha> {
    return await this.usuarioService.softDelte(id);
  }
}
