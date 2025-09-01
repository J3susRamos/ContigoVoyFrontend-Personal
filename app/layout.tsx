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
      <head>
        {/* Google tag (gtag.js) */}
        <script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-VTMM4ZV0VP"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VTMM4ZV0VP');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MVTPCQFR');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${lexend.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MVTPCQFR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}