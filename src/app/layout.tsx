import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAJ Chile - Asistencia Juridica | NewCooltura Informada",
  description: "Asistencia juridica gratuita, calculadora de mediacion familiar y servicios legales en Chile",
  keywords: ["CAJ", "asistencia juridica", "mediacion familiar", "servicios legales", "abogados gratis"],
  openGraph: {
    title: "CAJ Chile - NewCooltura Informada",
    description: "Asistencia juridica gratuita y servicios legales",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
