import NavbarUser from "@/components/User/Navbar/NavbarUser";
import React, { ReactNode } from "react";

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
      <div className="min-h-screen bg-[#eaeded]">
        <NavbarUser />
        <div className="min-h-[80vh] ml-20 lg:min-h-[89vh] lg:ml-72">
          {children}
        </div>
      </div>
  );
}
