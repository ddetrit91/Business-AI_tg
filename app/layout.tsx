import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Студия СИГНАЛ — сайт, который сам собирает заявки",
  description:
    "Веб-студия: лендинги, сайты компаний и ИИ-помощник для сбора заявок. Квиз, админка и дубль в Telegram.",
};

const themeBoot = `try{var t=localStorage.getItem("signal-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-theme="light"
      suppressHydrationWarning
      className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
