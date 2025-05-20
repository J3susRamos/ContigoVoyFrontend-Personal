"use client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import { Lexend } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/footer";
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
      <meta name="google-site-verification" content="E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY" />
      <title></title>
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
              getBaseRoute() !== "/user" ? "mt-[10vh] min-h-[90vh]" : ""
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