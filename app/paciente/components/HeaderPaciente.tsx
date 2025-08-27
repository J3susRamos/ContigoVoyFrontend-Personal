import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CerrarSesion from "@/components/CerrarSesion";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string; 
  avatar?: string; 
}

const HeaderPaciente = ({paciente} : {paciente: Paciente | null}) => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {paciente?.nombre?.charAt(0)}
                {paciente?.apellido?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Bienvenido{paciente ? `, ${paciente.nombre}` : ""}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {paciente?.apellido}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <CerrarSesion />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderPaciente;
