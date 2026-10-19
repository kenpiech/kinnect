import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { Session } from "@/components/Session";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f4f4f1" };

export const metadata: Metadata = {
  title: "Kinnect",
  description: "Add friends and read what they post. Text only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] font-sans sm:pb-0">
        <NavBar />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:py-8">
          <Session />
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
