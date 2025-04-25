import NavbarUser from "@/components/User/NavbarUser";
import { ThemeProvider } from "@/components/theme-provider";
import React, { ReactNode } from "react";

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[#eaeded]">
        <NavbarUser />
        <div className="min-h-[80vh] ml-20 lg:min-h-[89vh] lg:ml-72">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
