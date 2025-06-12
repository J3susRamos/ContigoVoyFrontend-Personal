"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Clients from "./clients";
import Appointments from "./appointments";
import Sales from "./sales";
import Performance from "./performance";

export default function ShowStadistic() {
  const [view, setView] = useState("clientes");
  const [rol, setRol] = useState(""); // rol del usuario
  const [allowedViews, setAllowedViews] = useState<string[]>([]); // vistas permitidas

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setRol(user.rol);

      if (user.rol === "ADMIN") {
        setAllowedViews(["clientes", "citas", "ventas", "rendimiento"]);
      } else if (user.rol === "PSICOLOGO") {
        setAllowedViews(["clientes", "citas", "ventas"]);
        setView("clientes"); 
      } else {
        setAllowedViews(["clientes"]); 
        setView("clientes");
      }
    }
  }, []);

  const allButtons = [
    { name: "Clientes", key: "clientes" },
    { name: "Citas", key: "citas" },
    { name: "Ventas", key: "ventas" },
    { name: "Rendimiento", key: "rendimiento" },
  ];

  const visibleButtons = allButtons.filter(btn =>
    allowedViews.includes(btn.key)
  );

  return (
    <div className="bg-[#f8f8ff] dark:bg-background">
      {/* Botones */}
      <div className="w-full h-16 bg-primary dark:bg-primary flex items-center justify-start">
        <div className="ml-10 flex justify-between items-center w-full max-w-[600px]">
          {visibleButtons.map((btn, index) => (
            <Button
              key={index}
              className={`${
                view === btn.key
                  ? "bg-white dark:bg-background text-primary dark:text-primary hover:bg-white hover:text-primary/80 dark:hover:bg-background dark:hover:text-primary/80"
                  : "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground hover:bg-primary/80 hover:text-white dark:hover:bg-primary/80 dark:hover:text-white"
              } text-[16px] leading-[20px] font-bold rounded-full px-9 py-2 transition-colors`}
              onClick={() => setView(btn.key)}
            >
              {btn.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-[#f8f8ff] dark:bg-background">
        {view === "clientes" && allowedViews.includes("clientes") && <Clientes />}
        {view === "citas" && allowedViews.includes("citas") && <Citas />}
        {view === "ventas" && allowedViews.includes("ventas") && <Ventas />}
        {view === "rendimiento" && allowedViews.includes("rendimiento") && <Rendimiento />}
      </div>
    </div>
  );
}

// Componentes
function Clientes() {
  return (
    <div className="text-xl font-bold text-primary dark:text-primary-foreground">
      <Clients />
    </div>
  );
}

function Citas() {
  return (
    <div className="text-xl font-bold text-primary dark:text-primary-foreground">
      <Appointments />
    </div>
  );
}

function Ventas() {
  return (
    <div className="text-xl font-bold text-primary dark:text-primary-foreground">
      <Sales />
    </div>
  );
}

function Rendimiento() {
  return (
    <div className="text-xl font-bold text-primary dark:text-primary-foreground">
      <Performance />
    </div>
  );
}
