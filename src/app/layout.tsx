import "./globals.css";
import Providers from "./components/Providers";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from 'sonner'; // Notifikasi premium
import NextTopLoader from 'nextjs-toploader';
import MainLayoutWrapper from "./components/MainLayoutWrapper";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'RecipeShare',
    template: '%s | RecipeShare',
  },
  description: "Temukan dan bagikan resep masakan terbaik dari seluruh dunia.",
};

const headingFont = Quicksand({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ['600', '700'],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Providers>
          {/* Gunakan NextTopLoader di sini, sangat simpel */}
          <NextTopLoader
            color="#2E8B57"
            showSpinner={false}
            shadow="0 0 10px #2E8B57,0 0 5px #2E8B57"
          />

          <Toaster position="top-center" richColors closeButton />

          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}