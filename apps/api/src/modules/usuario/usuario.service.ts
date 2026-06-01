import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUsuarioDto } from "./dtos/create-usuario.dto";
import {
  Cargo,
  GetUsuariosInput,
  Paginacao,
  Papel,
  ResumoAlunos,
  ResumoProfessores,
  UpdateUsuarioInput,
  Usuario,
  UsuarioSemSenha,
} from "@repo/types";
import { UsuarioRepository } from "./usuario.repository";
import * as bcrypt from "bcrypt";

import { normalizarString } from "@repo/utils";
import { Prisma } from "@repo/database";

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async createUsuario(dados: CreateUsuarioDto): Promise<UsuarioSemSenha> {
    const usuario = await this.usuarioRepository.getUsuarioPorUsuario(
      dados.usuario,
    );

    if (usuario) {
      throw new BadRequestException(
        "Já existe um usuário cadastrado com este usuário.",
      );
    }

    dados.senha = await bcrypt.hash(dados.senha, 10);

    let novoUsuario: Usuario | null;

    if (dados.papel === Papel.ADMINISTRADOR) {
      novoUsuario = await this.usuarioRepository.createAdministrador(dados);
    } else if (dados.papel === Papel.PROFESSOR) {
      novoUsuario = await this.usuarioRepository.createProfessor(dados);
    } else {
      novoUsuario = await this.usuarioRepository.createAluno(dados);
    }

    if (!novoUsuario) {
      throw new BadRequestException("Erro ao criar usuário.");
    }

    const { senha, ...novoUsuarioSemSenha } = novoUsuario;

    return novoUsuarioSemSenha;
  }

  async updateUsuario(
    id: number,
    dados: UpdateUsuarioInput,
  ): Promise<UsuarioSemSenha> {
    if (Object.keys(dados).length === 0) {
      throw new BadRequestException("Nenhum dado fornecido para a atuaização.");
    }

    const usuarioParaAtualizar =
      await this.usuarioRepository.getUsuarioPorId(id);

    if (!usuarioParaAtualizar) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (usuarioParaAtualizar.deleted_at) {
      throw new BadRequestException(
        "Um usuário inativo não pode ser atualizado.",
      );
    }

    if (dados.usuario) {
      const usuarioExistente =
        await this.usuarioRepository.getUsuarioPorUsuario(dados.usuario);

      if (usuarioExistente && usuarioExistente.id !== id) {
        throw new BadRequestException("Este usuário já está em uso.");
      }
    }

    if (dados.cargo && usuarioParaAtualizar.papel !== Papel.ADMINISTRADOR) {
      throw new BadRequestException("Somente administradores podem ter cargo.");
    }

    const nome_search = dados.nome ? normalizarString(dados.nome) : undefined;

    dados.senha = dados.senha ? await bcrypt.hash(dados.senha, 10) : undefined;

    const usuarioAtualizado = await this.usuarioRepository.updateUsuario(id, {
      ...dados,
      nome_search,
    });

    const { senha, ...usuarioSemSenha } = usuarioAtualizado;

    return usuarioSemSenha;
  }

  async getAllUsuarios(
    params: GetUsuariosInput,
  ): Promise<Paginacao<UsuarioSemSenha>> {
    const { dados, meta } = await this.usuarioRepository.getAllUsuarios(params);

    const usuariosSemSenha = dados.map((usuario) => {
      const { senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    });

    return {
      dados: usuariosSemSenha,
      meta,
    };
  }

  async getUsuarioPorId(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Usuario | null> {
    return await this.usuarioRepository.getUsuarioPorId(id, tx);
  }

  async getProfessorPorId(
    professorId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Usuario | null> {
    return await this.usuarioRepository.getProfessorPorId(professorId, tx);
  }

  async getAlunoPorId(
    alunoId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Usuario | null> {
    return await this.usuarioRepository.getAlunoPorId(alunoId, tx);
  }

  async countAllAlunosAtivosComMatriculaCursando(): Promise<ResumoAlunos> {
    const quantidade =
      await this.usuarioRepository.countAllAlunosAtivosComMatriculaCursando();
    return { quantidade };
  }

  async countAllProfessoresAtivos(): Promise<ResumoProfessores> {
    const quantidade = await this.usuarioRepository.countAllProfessoresAtivos();
    return { quantidade };
  }

  async softDelte(id: number): Promise<UsuarioSemSenha> {
    const usuario = await this.usuarioRepository.getUsuarioPorId(id);

    if (!usuario) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (usuario.deleted_at) {
      throw new BadRequestException("Usuário já está inativado.");
    }

    const { senha, ...usuarioInativado } =
      await this.usuarioRepository.softDelete(id);

    return usuarioInativado;
  }

  async restore(id: number): Promise<UsuarioSemSenha> {
    const usuario = await this.usuarioRepository.getUsuarioPorId(id);

    if (!usuario) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (!usuario.deleted_at) {
      throw new BadRequestException("Usuário já está ativado.");
    }

    const { senha, ...usuarioInativado } =
      await this.usuarioRepository.restore(id);

    return usuarioInativado;
  }
}
