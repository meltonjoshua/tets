import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OurFlat — One App. Two People. Always In Sync.",
  description:
    "The world's first life management app designed for two people sharing a home. Shopping lists, chores, calendar, meal planning, expense splitting, and more — all in one beautiful, real-time synced app.",
  keywords: [
    "shared shopping list",
    "chore tracker",
    "couples app",
    "meal planning",
    "expense splitting",
    "shared calendar",
    "home management",
    "flatmate app",
  ],
  openGraph: {
    title: "OurFlat",
    description: "One app. Two people. Every shared task, list, and reminder. Always in sync.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}