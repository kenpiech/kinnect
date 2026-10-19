import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  title: "Kinnect",
  description: "Add friends and read what they post. Text only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <NavBar />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-ink">
          <p className="mx-auto max-w-2xl px-4 py-4 text-sm text-muted">
            Sample friends · saved on this device
          </p>
        </footer>
      </body>
    </html>
  );
}
