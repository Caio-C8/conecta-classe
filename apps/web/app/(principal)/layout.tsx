import Navbar from "@/components/layout/navbar";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full py-6 px-4 md:py-[50px] md:px-[60px]">
        {children}
      </main>
    </div>
  );
}
