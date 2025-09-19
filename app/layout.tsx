import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Lexend } from "next/font/google";
import { ToastContainer } from "react-toastify";
import React from "react";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
// import ClientRedirect from "@/components/ClientRedirect"; // Temporalmente deshabilitado

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      <body className={`${lexend.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ClientRedirect /> Temporalmente deshabilitado para debugging */}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
        <ToastContainer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
    </html>
  );
}
