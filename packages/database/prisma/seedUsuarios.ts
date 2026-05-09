import { PrismaClient, Papel, Cargo } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando dados anteriores...");

  // Tabelas dependentes primeiro
  await prisma.notaEvento.deleteMany();
  await prisma.frequencia.deleteMany();
  await prisma.rendimentoDisciplina.deleteMany();

  await prisma.evento.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.professorTurma.deleteMany();

  await prisma.turma.deleteMany();
  await prisma.disciplina.deleteMany();

  // Limpando os perfis específicos e usuários
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.administrador.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("🌱 Iniciando o seed de Usuários (Múltiplos Perfis)...");

  const senhaHash = await bcrypt.hash("Senha123@", 10);

  // Lista de 24 usuários variados para testar paginação e filtros
  const usuariosParaCriar = [
    // Administradores (3)
    {
      nome: "Marcos Diretor",
      usuario: "marcos.diretor",
      papel: Papel.ADMINISTRADOR,
      cargo: Cargo.DIRETORA,
    },
    {
      nome: "Ana Secretaria",
      usuario: "ana.secretaria",
      papel: Papel.ADMINISTRADOR,
      cargo: Cargo.SECRETARIA,
    },
    {
      nome: "Carlos Suporte",
      usuario: "carlos.suporte",
      papel: Papel.ADMINISTRADOR,
      cargo: Cargo.SECRETARIA,
    },

    // Professores (6)
    {
      nome: "Roberto Matemática",
      usuario: "roberto.prof",
      papel: Papel.PROFESSOR,
    },
    {
      nome: "Fernanda Biologia",
      usuario: "fernanda.prof",
      papel: Papel.PROFESSOR,
    },
    { nome: "Claudio Física", usuario: "claudio.prof", papel: Papel.PROFESSOR },
    {
      nome: "Juliana História",
      usuario: "juliana.prof",
      papel: Papel.PROFESSOR,
    },
    { nome: "Pedro Geografia", usuario: "pedro.prof", papel: Papel.PROFESSOR },
    { nome: "Silvia Inglês", usuario: "silvia.prof", papel: Papel.PROFESSOR },

    // Alunos (15)
    { nome: "Lucas Calendário", usuario: "lucas.aluno", papel: Papel.ALUNO },
    { nome: "Amanda Silva", usuario: "amanda.aluno", papel: Papel.ALUNO },
    { nome: "Bruno Costa", usuario: "bruno.aluno", papel: Papel.ALUNO },
    { nome: "Camila Dias", usuario: "camila.aluno", papel: Papel.ALUNO },
    { nome: "Daniel Farias", usuario: "daniel.aluno", papel: Papel.ALUNO },
    { nome: "Eduarda Gomes", usuario: "eduarda.aluno", papel: Papel.ALUNO },
    { nome: "Felipe Henrique", usuario: "felipe.aluno", papel: Papel.ALUNO },
    { nome: "Gabriela Igor", usuario: "gabriela.aluno", papel: Papel.ALUNO },
    { nome: "Henrique Justo", usuario: "henrique.aluno", papel: Papel.ALUNO },
    { nome: "Isabela Kley", usuario: "isabela.aluno", papel: Papel.ALUNO },
    { nome: "João Lucas Mendes", usuario: "joao.aluno", papel: Papel.ALUNO },
    { nome: "Karina Nunes", usuario: "karina.aluno", papel: Papel.ALUNO },
    {
      nome: "Leonardo Oliveira",
      usuario: "leonardo.aluno",
      papel: Papel.ALUNO,
    },
    { nome: "Mariana Pinto", usuario: "mariana.aluno", papel: Papel.ALUNO },
    { nome: "Nicolas Quadros", usuario: "nicolas.aluno", papel: Papel.ALUNO },
  ];

  for (const u of usuariosParaCriar) {
    // Definindo a relação correta de acordo com o papel
    let relacao = {};
    if (u.papel === Papel.ADMINISTRADOR) {
      relacao = { administrador: { create: { cargo: u.cargo } } };
    } else if (u.papel === Papel.PROFESSOR) {
      relacao = { professor: { create: {} } };
    } else if (u.papel === Papel.ALUNO) {
      relacao = { aluno: { create: {} } };
    }

    // Criando a partir da tabela Usuario (como feito no UsuarioRepository)
    await prisma.usuario.create({
      data: {
        usuario: u.usuario,
        senha: senhaHash,
        nome: u.nome,
        // Simulando a função normalizarString
        nome_search: u.nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
        papel: u.papel,
        trocar_senha: false,
        ...relacao,
      },
    });
  }

  console.log(`✅ ${usuariosParaCriar.length} Usuários criados com sucesso!`);
  console.log("--------------------------------------------------");
  console.log(`📌 DADOS PARA TESTAR A ROTA DE BUSCAR USUÁRIOS:`);
  console.log(`   Para fazer login e acessar a rota, use o Administrador:`);
  console.log(`   Usuário (Login): marcos.diretor`);
  console.log(`   Senha: Senha123@`);
  console.log(`   Endpoint Base: GET /usuarios`);
  console.log(`   Exemplos de Filtros: `);
  console.log(`     - Paginação: /usuarios?pagina=1&limite=10`);
  console.log(`     - Por papel: /usuarios?papel=ALUNO`);
  console.log(`     - Por pesquisa: /usuarios?pesquisa=silva`);
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
