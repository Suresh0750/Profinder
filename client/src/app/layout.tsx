import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
import ProvidersWrapper from './ProvidersWrapper';
import './globals.css';
import Navbar from '@/components/Navbar/page';
import Footer from '@/components/Footer';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "ProFinder",
  description: "ProFinder connects you with trusted blue-collar workers like plumbers, electricians, carpenters, and more. Easily find and hire skilled professionals based on location and services. Get quick, reliable help whenever you need it!",
  icons: {
    icon: '/images/logo/pr-finder-high-resolution-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <StoreProvider>
        {children}
        </StoreProvider>
      </body>
    </html>
  );
  
}
