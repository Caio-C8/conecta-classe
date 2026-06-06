"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { useLogout } from "@/features/autenticacao/hooks/use-autenticacao";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-[#F5F5F6]/70 backdrop-blur-md border-b border-[#CCCCCC] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4 md:gap-14">
        <Link href={`/${currentModule}`} className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Logo Conecta Classe"
            width={32}
            height={32}
            className="md:w-10 md:h-10"
          />
          <span className="text-xl md:text-2xl font-bold">
            Conecta<span className="font-medium">Classe</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {currentLinks.map((link, index) => {
            const isActive =
              link.href === `/${currentModule}`
                ? pathname === link.href
                : pathname.startsWith(link.href);
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="hover:text-[#EF4444] transition-colors cursor-pointer"
              title="Sair do sistema"
            >
              <LogOut />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sair do sistema</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Sair</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className="md:hidden text-zinc-800 hover:text-black transition-colors"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#F5F5F6] border-b border-[#CCCCCC] shadow-lg md:hidden">
          <nav className="flex flex-col">
            {currentLinks.map((link, index) => {
              const isActive =
                link.href === `/${currentModule}`
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    px-6 py-4 text-[15px] border-t border-[#E5E5E5] transition-colors
                    ${isActive ? "font-bold bg-gray-200/50" : "font-medium hover:bg-gray-100/50"}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
