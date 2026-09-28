import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TrackMyRepo",
  description:
    "Dashboard pessoal para acompanhamento de repositórios públicos do GitHub.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
