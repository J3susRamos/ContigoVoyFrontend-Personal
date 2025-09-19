// app/marketing/crear/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CrearPlantilla from "@/components/User/Marketing/CrearPlantilla";

const CrearPlantillaPage = () => {
  const router = useRouter();

  return <CrearPlantilla onBack={() => router.push("/user/marketing")} />;
};

export default CrearPlantillaPage;
