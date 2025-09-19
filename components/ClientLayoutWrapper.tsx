"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/mainNavbar/Navbar";
import Footer from "@/components/footer/footer";
import { ReactNode } from "react";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  const getBaseRoute = () => {
    const pathParts = pathname.split("/");
    return `/${pathParts[1]}`;
  };

  const baseRoute = getBaseRoute();
  const hideLayout = ["/user", "/admin", "/paciente"].includes(baseRoute);

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className={`${baseRoute !== "/user" ? " min-h-[90vh]" : ""}`}>
        {children}
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}
