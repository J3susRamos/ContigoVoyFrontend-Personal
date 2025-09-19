"use client";
import React, { Suspense } from "react";
import RegistroFamiliarWrapper from "./RegistroFamiliarWrapper";

export default function App() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Cargando información...</p>}>
    <RegistroFamiliarWrapper />
  </Suspense>
  );
}
