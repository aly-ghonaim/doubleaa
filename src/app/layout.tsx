import type { Metadata } from "next";
import { Libre_Caslon_Display, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Print-letterpress serif for display — set large, roman-led (emphasis comes from the riso inks,
// not italic). Deliberately not a Didone and not the Fraunces/Playfair default.
const caslon = Libre_Caslon_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="en">
      <head>
        <noscript>
          {/* Without JS, entrance animations never run — show everything at rest. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${caslon.variable} ${hanken.variable} ${jetbrains.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
