import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "doubleaa — web development & AI automation",
  description:
    "A two-person studio by Aly Ghonaim & Abdullah. We build responsive websites and the n8n/AI automations that run behind them.",
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
          // Apply saved theme before paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('daa-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
