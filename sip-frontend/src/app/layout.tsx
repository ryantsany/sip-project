import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perpustakaan SIP",
  description: "Aplikasi Sistem Informasi Perpustakaan",
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="...">
        <AuthProvider>{children}</AuthProvider>
        
        <Toaster 
          position="top-center" 
          toastOptions={{
            classNames: {
              title: "!text-slate-900 !font-bold !text-base",
              description: "!text-slate-600 !text-sm",
              actionButton: "!bg-slate-900 !text-white",
              toast: "!bg-white !border-slate-200 !shadow-lg",
            },
          }}
        />
        
      </body>
    </html>
  );
}
