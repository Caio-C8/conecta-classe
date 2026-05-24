import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conecta Classe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <div className="text-[#18181B] bg-[#F1F1F2]">{children}</div>
      </body>
    </html>
  );
}
