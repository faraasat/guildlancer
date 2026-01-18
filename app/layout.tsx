import type { Metadata } from "next";
import { Space_Grotesk, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GuildLancer - Guildified Trust Platform",
  description:
    "A guild-based, trust-driven bounty resolution platform powered by community governance and AI-assisted decision making.",
  keywords: ["guilds", "bounties", "trust", "community", "governance", "web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen pt-16" suppressHydrationWarning>
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
