"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PlantillasGuardadas from "@/components/User/Marketing/PlantillasGuardadas";

const PlantillasGuardadasPage = () => {
  const router = useRouter();

  return <PlantillasGuardadas onBack={() => router.back()} />;
};

export default PlantillasGuardadasPage;
