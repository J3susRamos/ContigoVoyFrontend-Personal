"use client";

import ListarCitasSinPagar from "@/components/User/CitasSinPagar/ListarCitasSinPagar";
import { NavbarCitasSinPagar } from "@/components/User/CitasSinPagar/navbar/NavbarCitasSinPagar";
import HeaderUser from '@/components/User/HeaderUser'
import { FiltersCitasSinPagar } from '@/interface';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'


const FiltersCitasInitialState: FiltersCitasSinPagar = {
  genero: [],
  edad: [],
  fechaInicio: [],
  codigo: [],
};

export default function CitasSinPagar() {

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [filters, setFilters] = useState<FiltersCitasSinPagar>(FiltersCitasInitialState);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol !== "ADMIN") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  if (isAuthorized === null) return null;

  return (
    <div className="bg-[#f6f7f7] dark:bg-[#121212] min-h-screen flex flex-col">
      <HeaderUser title="Lista de citas sin pagar" />
      <NavbarCitasSinPagar
        filterValue={filterValue}
        filters={filters}
        setFilters={setFilters}
        onSearchChange={onSearchChange}
        menuOpen={menuAbierto}
        setMenuOpen={setMenuAbierto}
      />
      <ListarCitasSinPagar
        filters={filters}
        filterValue={filterValue}
      />
    </div>
  )
}
