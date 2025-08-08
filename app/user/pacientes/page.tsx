"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPacienteSection from "@/components/User/Pacientes/Admin/section/AdminPacienteSection";
import PsicoPacienteSection from "@/components/User/Pacientes/Psicologo/section/PsicoPacienteSection";
import LoadingSpinner from "@/components/User/Marketing/LoadingSpinner";

export default function Pacientes() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.rol === "PSICOLOGO" || userData.rol === "ADMIN") {
            setIsAuthorized(true);
            setRole(userData.rol);
        } else {
            router.push("/unauthorized");
        }
    }, [router]);

    if (isAuthorized === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (

        <>
            {role === "PSICOLOGO" && <PsicoPacienteSection />}

            {role === "ADMIN" && <AdminPacienteSection />}
        </>

    );

}
