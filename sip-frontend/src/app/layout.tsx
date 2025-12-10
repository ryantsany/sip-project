import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const fontSans = Kanit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Perpustakaan SIP",
  description: "Aplikasi Sistem Informasi Perpustakaan",
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${fontSans.variable} antialiased`}>
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
