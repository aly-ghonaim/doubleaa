import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "doubleaa — web development & AI automation",
  description:
    "A two-person studio by Aly Ghonaim & Abdullah Eissa. We build responsive websites and the n8n/AI automations that run behind them.",
  openGraph: {
    title: "doubleaa — web development & AI automation",
    description:
      "A two-person studio. We build the website and the machine that runs behind it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Dark is the committed identity; apply saved theme before paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('daa-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}",
          }}
        />
        <noscript>
          {/* Without JS, entrance animations never run — show everything at rest. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${bricolage.variable} ${hanken.variable} ${jetbrains.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
