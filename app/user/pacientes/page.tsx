"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import ListarPacientes from "@/components/User/Pacientes/ListarPacientes";
import HeaderUser from "@/components/User/HeaderUser";
import {NavbarPacientes} from "@/components/User/Pacientes/NavbarPacientesComponent";
import {FiltersInitialState, FiltersPaciente} from "@/interface";

export default function Pacientes() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [filterValue, setFilterValue] = useState("");
    const [filters, setFilters] = useState<FiltersPaciente>(FiltersInitialState);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const onSearchChange = (value?: string) => {
        setFilterValue(value || "");
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.rol !== "PSICOLOGO") {
            router.push("/unauthorized");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (isAuthorized === null) {
        return (
            <div className="flex justify-center items-center h-screen">
            </div>
        );
    }

    return (
        <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
            <HeaderUser title="Lista de pacientes"/>
            <NavbarPacientes
                filterValue={filterValue}
                onSearchChange={onSearchChange}
                filters={filters}
                setFilters={setFilters}
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
            />
            <section className={`${menuAbierto && 'opacity-50'}`}>
                <ListarPacientes filters={filters} filterValue={filterValue}/>
            </section>
        </div>
    );
}
