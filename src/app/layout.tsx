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

export const metadata: Metadata = { title: "智學通｜108課綱 AI 蘇格拉底家教", description: "支援台灣108課綱全版本課本生成、Word 講義匯出與一對一蘇格拉底式引導解題的 AI 學習平台。", applicationName: "智學通 AI 家教", openGraph: { siteName: "智學通 AI 家教", title: "智學通｜108課綱 AI 蘇格拉底家教", description: "一鍵生成完整全冊課本與 Word 檔，AI 蘇格拉底一對一引導解題。", type: "website" } };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
