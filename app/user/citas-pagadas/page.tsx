"use client";

import ListarCitasPagadas from "@/components/User/CitasPagadas/ListarCitasPagadas";
import { NavbarCitaPagada } from "@/components/User/CitasPagadas/navbar/NavbarCitaPagada";
import HeaderUser from "@/components/User/HeaderUser";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function CitasPagadas() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.rol === "ADMIN" || userData.rol === "ADMINISTRADOR" || userData.rol === "COMUNICACION" || userData.rol === "MARKETING") {
      setIsAuthorized(true);
    } else {
      router.push("/unauthorized");
    }
  }, [router]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  if (isAuthorized === null) return null;

  return (
    <div className="bg-[#f6f7f7] dark:bg-[#121212] min-h-screen flex flex-col">
      <HeaderUser title="Lista de citas pagadas" />
      <NavbarCitaPagada
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        menuOpen={menuAbierto}
        setMenuOpen={setMenuAbierto}
      />
      <ListarCitasPagadas filterValue={filterValue} />
    </div>
  );
}
