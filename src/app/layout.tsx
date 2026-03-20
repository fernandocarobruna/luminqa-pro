import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuminQA — Guía Comercial para Partners",
  description: "Plataforma de automatización de QA con IA. Guía comercial, simuladores de pricing, ROI y benchmark de mercado.",
  openGraph: {
    title: "LuminQA — Guía Comercial para Partners",
    description: "Plataforma de automatización de QA con IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
