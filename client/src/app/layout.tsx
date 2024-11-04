import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
import ProvidersWrapper from './ProvidersWrapper';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProFinder",
  description: "ProFinder connects you with trusted blue-collar workers like plumbers, electricians, carpenters, and more. Easily find and hire skilled professionals based on location and services. Get quick, reliable help whenever you need it!",
  icons: {
    icon: '/images/logo/pr-finder-high-resolution-logo.png',  // Corrected path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
