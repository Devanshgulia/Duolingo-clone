import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Duolingo — The world's best way to learn a language",
  description: "Learn languages with bite-sized lessons, interactive exercises, XP, streaks, and gamification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#131f24] text-white selection:bg-[#58cc02]/30">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
