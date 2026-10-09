import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", weight: ["400", "500", "600", "700"] });
const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: {
    default: "AURORA · Polar Knowledge Portal",
    template: "%s · AURORA",
  },
  description: "SIH26063 prototype for the Ministry of Earth Sciences: catalogue polar records, search them semantically, and publish citation-locked outreach.",
};

const themeScript = `try{var raw=localStorage.getItem("aurora-ui");var theme="system";if(raw){var parsed=JSON.parse(raw);theme=(parsed.state&&parsed.state.theme)||"system";}var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased">
        <div className="intro-veil" aria-hidden>
          <span>AURORA</span>
        </div>
        <Script id="aurora-theme" strategy="beforeInteractive">{themeScript}</Script>
        <Providers>
          <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
            Skip to content
          </a>
          <Header />
          <div id="content">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
