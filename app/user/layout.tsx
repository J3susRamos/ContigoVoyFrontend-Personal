"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import NavbarUser from "@/components/User/Navbar/NavbarUser";
import React, { ReactNode } from "react";

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#eaeded]">
        <NavbarUser />
        <div className="min-h-[80vh] lg:min-h-[89vh] lg:ml-72">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}