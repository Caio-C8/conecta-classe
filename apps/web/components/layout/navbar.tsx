"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { useLogout } from "@/hooks/use-autenticacao";

const navConfig = {
  admin: [
    { label: "Painel Geral", href: "/admin" },
    { label: "Usuários", href: "/admin/usuarios" },
    { label: "Turmas", href: "/admin/turmas" },
    { label: "Disciplinas", href: "/admin/disciplinas" },
  ],
  professor: [
    { label: "Painel Geral", href: "/professor" },
    { label: "Frequência", href: "/professor/frequencia" },
    { label: "Eventos", href: "/professor/eventos" },
    {
      label: "Criar Evento",
      href: "/professor/eventos/criar",
    },
  ],
  aluno: [
    { label: "Painel Geral", href: "/aluno" },
    { label: "Frequência", href: "/aluno/frequencia" },
    { label: "Notas", href: "/aluno/notas" },
    { label: "Calendário", href: "/aluno/calendario" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const currentModule = pathname.split("/")[1] as keyof typeof navConfig;
  const currentLinks = navConfig[currentModule] || [];

  const logout = useLogout();

  return (
    <header className="bg-[#F5F5F6]/70 backdrop-blur-md border-b border-[#CCCCCC] px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-14">
        <Link href={`/${currentModule}`} className="flex items-center gap-2">
          <Image src={Logo} alt="Logo Conecta Classe" width={40} height={40} />
          <span className="text-xl font-semibold">Conecta Classe</span>
        </Link>

        <nav className="flex gap-6">
          {currentLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={index}
                href={link.href}
                className={`
                    relative pb-1 text-[15px] no-underline transition-colors duration-300
                    
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-full after:h-[2px] after:bg-black 
                    after:transition-transform after:duration-300 after:origin-left
                    
                    ${
                      isActive
                        ? "font-medium after:scale-x-100"
                        : "font-medium after:scale-x-0 hover:after:scale-x-100"
                    }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="hover:text-[#EF4444] transition-colors cursor-pointer"
        >
          <LogOut />
        </button>
      </div>
    </header>
  );
}
