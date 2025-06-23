
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PlantillasEnviadas from "@/components/User/Marketing/PlantillasEnviadas";

const PlantillasEnviadasPage = () => {
  const router = useRouter();

  return <PlantillasEnviadas onBack={() => router.back()} />;
};

export default PlantillasEnviadasPage;
