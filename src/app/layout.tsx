import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/sessionProvider";
// import AppSidebar from "@/components/layout/AppSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YAPPIE",
  description: "Brainrot Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/yappie.ico" sizes="any" />
        <link rel="icon" href="/yappie.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/yappie.ico" />
        <link rel="apple-touch-icon" href="/yappie.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh flex`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <main className="flex flex-col flex-1 overflow-hidden">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
