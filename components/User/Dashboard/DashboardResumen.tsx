"use client";
import React from "react";

export default function DashboardResumen() {
  return (
    <>
      <div className="space-y-6 md:max-w-xl w-full">
        <div className="bg-card rounded-3xl pt-8">
          <div className="flex rounded-r-full py-6 text-[#fff] bg-[#6364F4] justify-center font-normal text-2xl w-3/4 ">
            Resumen
          </div>
          <div className="mx-10 sm:mx-14 md:mx-20 lg:mx-24">
            <ul className="list-disc pl-7 text-[#634AE2] text-xl font-normal   p-6">
              <li> 0 citas completadas</li>
              <li> 7 citas pendientes</li>
              <li> 0 Citas canceladas</li>
              <li> 315 Minutos reservados</li>
            </ul>
          </div>
        </div>

        <div className="bg-card justify-items-center p-6 rounded-3xl text-[#634AE2]">
          <div className="font-normal text-xl">Total Paciente</div>
          <div className="font-bold text-6xl">7</div>
        </div>

        <div className="bg-card justify-items-center p-6 rounded-3xl text-[#634AE2]">
          <div className="font-normal text-xl">Nuevos Pacientes</div>
          <div className="font-bold text-6xl">0</div>
        </div>
      </div>
    </>
  );
}