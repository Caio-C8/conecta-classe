import { Cargo, Papel, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const administrador = {
    usuario: "adm",
    senha: await bcrypt.hash("Senha123@", 10),
    nome: "Administrador",
    nome_search: "administrador",
    papel: Papel.ADMINISTRADOR,
    trocar_senha: false,
    cargo: Cargo.DIRETORA,
  };

  await prisma.usuario.deleteMany({
    where: {
      usuario: administrador.usuario,
    },
  });

  await prisma.usuario.create({
    data: {
      usuario: administrador.usuario,
      senha: administrador.senha,
      nome: administrador.nome,
      nome_search: administrador.nome_search,
      papel: administrador.papel,
      trocar_senha: administrador.trocar_senha,
      administrador: {
        create: {
          cargo: administrador.cargo,
        },
      },
    },
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
