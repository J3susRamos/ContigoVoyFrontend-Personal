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
    <head>
      <meta charSet="utf-8"/>
      <meta http-equiv="Content-Language" content="es" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="Contigo Voy" />
      <meta name="google-site-verification" content="E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY" />
    </head>
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
            className={`${
              getBaseRoute() !== "/user" ? " min-h-[90vh]" : ""
            }`}
          >
            {children}
          </div>
          {getBaseRoute() !== "/user" && getBaseRoute() !== "/admin" && (
            <Footer />
          )}
        </ThemeProvider >
        <ToastContainer />
      </body>
    </html>
  );
}
