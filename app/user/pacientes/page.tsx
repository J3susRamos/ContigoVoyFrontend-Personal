"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListarPacientes from "@/components/PacientesLista/ListarPacientes";
import LoadingPages from "@/components/LoadingPages";

export default function Pacientes() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol === "ADMIN") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingPages />
      </div>
    );
  }

  return (
    <div>
      <ListarPacientes />
    </div>
  );
}
