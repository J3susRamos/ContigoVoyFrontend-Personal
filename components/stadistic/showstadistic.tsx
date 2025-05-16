"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Clients from "./clients";
import Appointments from "./appointments";
import Sales from "./sales";
import Performance from "./performance";

export default function ShowStadistic() {
  const [view, setView] = useState("clientes");

  const buttons = [
    { name: "Clientes", action: () => setView("clientes") },
    { name: "Citas", action: () => setView("citas") },
    { name: "Ventas", action: () => setView("ventas") },
    { name: "Rendimiento", action: () => setView("rendimiento") },
  ];

  return (
    <div className="bg-background dark:bg-background">
      {/* Barra de botones */}
      <div className="w-full h-16 bg-primary dark:bg-primary flex items-center justify-start">
        <div className="ml-10 flex justify-between items-center w-full max-w-[600px]">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              className={`${
                view === btn.name.toLowerCase()
                  ? "bg-background dark:bg-background text-primary dark:text-primary"
                  : "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground"
              } text-[16px] leading-[20px] font-bold rounded-full px-9 py-2`}
              onClick={btn.action}
            >
              {btn.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-background dark:bg-background">
        {view === "clientes" && <Clientes />}
        {view === "citas" && <Citas />}
        {view === "ventas" && <Ventas />}
        {view === "rendimiento" && <Rendimiento />}
      </div>
    </div>
  );
}

function Clientes() {
  return <div className="text-xl font-bold text-primary dark:text-primary-foreground">
    <Clients />
  </div>;
}

function Citas() {
  return <div className="text-xl font-bold text-primary dark:text-primary-foreground">
    <Appointments />
  </div>;
}

function Ventas() {
  return <div className="text-xl font-bold text-primary dark:text-primary-foreground">
    <Sales />
  </div>;
}

function Rendimiento() {
  return <div className="text-xl font-bold text-primary dark:text-primary-foreground">
    <Performance />
  </div>;
}
