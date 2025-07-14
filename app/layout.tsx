"use client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/mainNavbar/Navbar";
import { usePathname } from "next/navigation";
import { Lexend } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/footer/footer";
import React from "react";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const getBaseRoute = () => {
    const pathParts = pathname.split("/");
    return `/${pathParts[1]}`;
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {getBaseRoute() !== "/user" && getBaseRoute() !== "/admin" && (
            <Navbar />
          )}
          <div
            className={`${getBaseRoute() !== "/user" ? " min-h-[90vh]" : ""}`}
          >
            {children}
          </div>
          {getBaseRoute() !== "/user" && getBaseRoute() !== "/admin" && (
            <Footer />
          )}
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
