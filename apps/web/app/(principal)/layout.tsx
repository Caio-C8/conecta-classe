import Navbar from "@/components/layout/navbar";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col text-[#18181B] bg-[#F1F1F2]">
      {/* O Header será renderizado para admin, aluno e professor */}
      <Navbar />

      {/* O conteúdo específico de cada página vai aqui */}
      <main className="flex-1 py-[50px] px-[60px]">{children}</main>
    </div>
  );
}
