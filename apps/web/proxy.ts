import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const papel = request.cookies.get("papel")?.value;
  const trocarSenha = request.cookies.get("trocar_senha")?.value === "true";

  const isRootPage = pathname === "/";
  const isLoginPage = pathname === "/login" || pathname === "/";
  const isTrocarSenhaPage = pathname === "/trocar-senha";

  if (isRootPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (trocarSenha) {
      return NextResponse.redirect(new URL("/trocar-senha", request.url));
    }
    return redirecionarPorPapel(papel, request.url);
  }

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (trocarSenha) {
    if (!isTrocarSenhaPage) {
      return NextResponse.redirect(new URL("/trocar-senha", request.url));
    }
    return NextResponse.next();
  }

  if (isLoginPage || isTrocarSenhaPage) {
    return redirecionarPorPapel(papel, request.url);
  }

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

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
