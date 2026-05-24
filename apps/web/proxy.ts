import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Obter os cookies de autenticação
  const token = request.cookies.get("token")?.value;
  const papel = request.cookies.get("papel")?.value;
  const trocarSenha = request.cookies.get("trocar_senha")?.value === "true";

  // 2. Definir as páginas de autenticação com os novos caminhos
  const isLoginPage = pathname === "/login" || pathname === "/";
  const isTrocarSenhaPage = pathname === "/trocar-senha";

  // 3. SE NÃO ESTIVER LOGADO
  if (!token) {
    if (!isLoginPage) {
      // Tenta acessar rota privada sem token -> Redireciona para o Login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // === DIRETRIZES PARA USUÁRIO AUTENTICADO ===

  // 4. FORÇAR TROCA DE SENHA
  if (trocarSenha) {
    if (!isTrocarSenhaPage) {
      return NextResponse.redirect(new URL("/trocar-senha", request.url));
    }
    return NextResponse.next();
  }

  // 5. SE ESTIVER LOGADO E TENTAR ACESSAR LOGIN OU TROCA DE SENHA
  if (isLoginPage || isTrocarSenhaPage) {
    return redirecionarPorPapel(papel, request.url);
  }

  // 6. PROTEÇÃO DE ROTAS POR PERFIL (Baseado estritamente nas novas pastas)
  if (pathname.startsWith("/admin") && papel !== "ADMINISTRADOR") {
    return redirecionarPorPapel(papel, request.url);
  }

  if (pathname.startsWith("/professor") && papel !== "PROFESSOR") {
    return redirecionarPorPapel(papel, request.url);
  }

  if (pathname.startsWith("/aluno") && papel !== "ALUNO") {
    return redirecionarPorPapel(papel, request.url);
  }

  return NextResponse.next();
}

/**
 * Função utilitária para centralizar o redirecionamento seguro
 * com base no papel do usuário autenticado
 */
function redirecionarPorPapel(papel: string | undefined, baseUrl: string) {
  switch (papel) {
    case "ADMINISTRADOR":
      return NextResponse.redirect(new URL("/admin", baseUrl));
    case "PROFESSOR":
      return NextResponse.redirect(new URL("/professor", baseUrl));
    case "ALUNO":
      return NextResponse.redirect(new URL("/aluno", baseUrl));
    default:
      return NextResponse.redirect(new URL("/login", baseUrl));
  }
}

// Configuração do Matcher para ignorar requisições internas, arquivos estáticos e imagens
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
