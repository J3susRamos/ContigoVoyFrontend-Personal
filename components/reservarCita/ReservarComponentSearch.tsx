import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Divider } from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Authors, Categoria } from "@/interface";
import { Avatar, Button } from "@heroui/react";
import { Tag, Flag, GraduationCap, BookA, User } from "lucide-react";

const FILTER_OPTIONS = {
  pais: [
    { nombre: "México", valor: "MX", id: 1 },
    { nombre: "Colombia", valor: "CO", id: 2 },
    { nombre: "Argentina", valor: "AR", id: 3 },
    { nombre: "Perú", valor: "PE", id: 4 },
    { nombre: "Chile", valor: "CL", id: 5 },
  ],
  genero: [
    { nombre: "Femenino", valor: "femenino", id: 1 },
    { nombre: "Masculino", valor: "masculino", id: 2 },
  ],
  idioma: [
    { nombre: "Español", valor: "es", id: 1 },
    { nombre: "Ingles", valor: "en", id: 2 },
  ],
  enfoque: [
    { nombre: "Niños", valor: "niños", id: 1 },
    { nombre: "Adolescentes", valor: "adolescentes", id: 2 },
    { nombre: "Familiar", valor: "familiar", id: 3 },
    { nombre: "Pareja", valor: "pareja", id: 4 },
    { nombre: "Adulto", valor: "adulto", id: 5 },
  ],
};

export default function BlogAside({
  onCountryClick,
  activeCountry,
  onGenderClick,
  activeGender,
  onIdiomClick,
  activeIdiom,
  onApproachClick,
  activeApproach,
}: {
  onCountryClick: (categoryId: number) => void,
  activeCountry: number | null,
  onGenderClick: (genderId: number) => void,
  activeGender: number | null,
  onIdiomClick: (idiomId: number) => void,
  activeIdiom: number | null,
  onApproachClick: (approach: number) => void,
  activeApproach: number | null
}) {
  return (
    <div className="space-y-8">
      {/* Pais Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <Flag className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            País de tu psicólogo
          </h3>
        </div>

        <div className="space-y-3">
          {FILTER_OPTIONS.pais?.map((item) => (
            <Button
              key={item.id}
              onPress={() => onCountryClick(item.id)}
              variant={activeCountry === item.id ? "solid" : "bordered"}
              className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                activeCountry === item.id
                  ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                  : "bg-white/50 border-[#634AE2]/30 text-[#634AE2] dark:text-primary hover:bg-gradient-to-r hover:from-[#634AE2]/10 hover:to-[#8b7cf6]/10 hover:border-[#634AE2] backdrop-blur-sm"
              }`}
              radius="lg"
              size="lg"
            >
              <span className="truncate font-medium">{item.nombre}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Genero Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            Género
          </h3>
        </div>

        <div className="space-y-3">
          {FILTER_OPTIONS.genero?.map((item) => (
            <Button
              key={item.id}
              onPress={() => onGenderClick(item.id)}
              variant={activeGender === item.id ? "solid" : "bordered"}
              className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                activeGender === item.id
                  ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                  : "bg-white/50 border-[#634AE2]/30 text-[#634AE2] dark:text-primary hover:bg-gradient-to-r hover:from-[#634AE2]/10 hover:to-[#8b7cf6]/10 hover:border-[#634AE2] backdrop-blur-sm"
              }`}
              radius="lg"
              size="lg"
            >
              <span className="truncate font-medium">{item.nombre}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Idioma Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <BookA className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            Idioma
          </h3>
        </div>

        <div className="space-y-3">
          {FILTER_OPTIONS.idioma?.map((item) => (
            <Button
              key={item.id}
              onPress={() => onIdiomClick(item.id)}
              variant={activeIdiom === item.id ? "solid" : "bordered"}
              className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                activeIdiom === item.id
                  ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                  : "bg-white/50 border-[#634AE2]/30 text-[#634AE2] dark:text-primary hover:bg-gradient-to-r hover:from-[#634AE2]/10 hover:to-[#8b7cf6]/10 hover:border-[#634AE2] backdrop-blur-sm"
              }`}
              radius="lg"
              size="lg"
            >
              <span className="truncate font-medium">{item.nombre}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Enfoque Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            Enfoque
          </h3>
        </div>

        <div className="space-y-3">
          {FILTER_OPTIONS.enfoque?.map((item) => (
            <Button
              key={item.id}
              variant={activeApproach === item.id ? "solid" : "bordered"}
              onPress={() => onApproachClick(item.id)}
              className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                activeApproach === item.id
                  ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                  : "bg-white/50 border-[#634AE2]/30 text-[#634AE2] dark:text-primary hover:bg-gradient-to-r hover:from-[#634AE2]/10 hover:to-[#8b7cf6]/10 hover:border-[#634AE2] backdrop-blur-sm"
              }`}
              radius="lg"
              size="lg"
            >
              <span className="truncate font-medium">{item.nombre}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
