import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Lexend } from "next/font/google";
import { ToastContainer } from "react-toastify";
import React from "react";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
