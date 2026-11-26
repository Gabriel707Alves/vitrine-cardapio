import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitrine Cardápio",
  description: "Modelo de site para restaurantes com cardápio e pedido pelo WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
