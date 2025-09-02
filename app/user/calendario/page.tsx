"use client";

import AdminCalendarSection from "@/components/User/Calendario/Admin/AdminCalendarSection";
import CalendarioMain from "@/components/User/Calendario/Psicologo/CalendarioMain";
import LoadingSpinner from "@/components/User/Marketing/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Calendario() {
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
      {role === "PSICOLOGO" && <CalendarioMain />}

      {role === "ADMIN" && <AdminCalendarSection />}
    </>
  );
}
