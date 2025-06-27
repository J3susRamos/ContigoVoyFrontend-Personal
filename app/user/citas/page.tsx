"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/User/Citas/NavbarCitas";
import HeaderUser from "@/components/User/HeaderUser";
import { GenericFilters } from "@/components/ui/EmptyTable";
import ListarCitas from "@/components/User/Citas/ListarCitas";

export interface FiltersCitas extends GenericFilters {
  genero: string[];
  estado: string[];
  edad: string[];
  fechaInicio: string[];
}

const FiltersInitialState: FiltersCitas = {
  genero: [],
  estado: [],
  edad: [],
  fechaInicio: [],
};

export default function App() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [filters, setFilters] = useState<FiltersCitas>(FiltersInitialState);
  const [showFormCita, setShowFormCita] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol !== "PSICOLOGO") {
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
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <HeaderUser title="Lista de citas" />
      <Navbar
        filterValue={filterValue}
        filters={filters}
        setFilters={setFilters}
        onSearchChange={onSearchChange}
        onAddNew={() => setShowFormCita(true)}
        menuOpen={menuAbierto}
        setMenuOpen={setMenuAbierto}
      />
      <section className={`${menuAbierto && "opacity-50"}`}>
        <ListarCitas
          filters={filters}
          filterValue={filterValue}
          showFormCita={showFormCita}
          setShowFormCita={setShowFormCita}
        />
      </section>
    </div>
  );
}
