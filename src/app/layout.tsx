import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/ThemeProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import MobileBottomBar from "@/components/mobile/MobileBottomBar";
import AccountSync from "@/components/AccountSync";
import RouteTransition from "@/components/RouteTransition";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NOVARIX | Premium E-Commerce",
  description: "The silent precision of modern elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-svh flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AccountSync />
          <Navbar />
          <SmoothScroll>
            <main className="flex-1 flex w-full flex-col">
              <RouteTransition>{children}</RouteTransition>
            </main>
            {/* Footer carries the mobile bottom-bar clearance (pb-28 md:pb-0) */}
            <Footer />
          </SmoothScroll>
          <MobileBottomBar />
          <CartDrawer />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'font-body-md glass-card border-none',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
