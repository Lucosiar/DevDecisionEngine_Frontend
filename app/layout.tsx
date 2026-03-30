import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Decision Engine",
  description: "Analiza errores y repositorios para detectar hallazgos técnicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
