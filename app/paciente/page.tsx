"use client";

import { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarDays, 
  Video, 
  UploadCloud, 
  User, 
  Clock, 
  CreditCard,
  CheckCircle,
  FileImage,
  Calendar
} from "lucide-react";
import Image from "next/image";

// Tipos de datos
interface Paciente {
  nombre: string;
  apellido: string;
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  doctor: string;
  especialidad: string;
  estado: "confirmada" | "pendiente";
}

interface Pago {
  id: number;
  fecha: string;
  monto: number;
  voucher: string;
  estado: "aprobado" | "pendiente" | "rechazado";
  descripcion: string;
}

const Paciente = () => {
  // Estados
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Datos de ejemplo (normalmente vendrían de una API)
  const citasProximas: Cita[] = [
    {
      id: 1,
      fecha: "2025-07-28",
      hora: "16:00",
      doctor: "Dra. María López",
      especialidad: "Psicología Clínica",
      estado: "confirmada"
    },
    {
      id: 2,
      fecha: "2025-08-02",
      hora: "10:30",
      doctor: "Dr. Carlos Mendoza",
      especialidad: "Terapia Familiar",
      estado: "pendiente"
    }
  ];

  const historialPagos: Pago[] = [
    {
      id: 1,
      fecha: "2025-07-20",
      monto: 120.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1753067666/ljcukcivg7qgetcn80z4.png",
      estado: "aprobado",
      descripcion: "Consulta psicológica"
    },
    {
      id: 2,
      fecha: "2025-07-15",
      monto: 150.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1701525535/cld-sample.jpg",
      estado: "aprobado",
      descripcion: "Terapia de pareja"
    },
    {
      id: 3,
      fecha: "2025-07-10",
      monto: 180.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1753300369/w0ggqmpkko45uhayznev.png",
      estado: "pendiente",
      descripcion: "Evaluación psicológica"
    }
  ];

  // Efectos
  useEffect(() => {
    initializePaciente();
  }, []);

  // Funciones
  const initializePaciente = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.rol === "PACIENTE") {
          setPaciente({ 
            nombre: user.nombre, 
            apellido: user.apellido 
          });
        }
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // Aquí iría la lógica de subida del archivo
      console.log("Subiendo archivo:", selectedFile.name);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Comprobante subido exitosamente");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Error al subir el comprobante");
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'confirmada':
      case 'aprobado':
        return 'text-green-600 bg-green-50';
      case 'pendiente':
        return 'text-orange-600 bg-yellow-50';
      case 'rechazado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const joinVideoCall = (citaId: number) => {
    // Lógica para unirse a la videollamada
    
    console.log("Unirse a videollamada de cita:", citaId);
    window.open(`/videocall/${citaId}`, '_blank');
  };

  return (
    <div className="bg-[#f8f8ff] dark:bg-black min-h-screen">

      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* SECCIÓN: Encabezado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-foreground flex items-center gap-3">
              <User className="w-8 h-8" />
              Bienvenido{paciente ? `, ${paciente.nombre} ${paciente.apellido}` : ""}
            </h1>
            <p className="text-base text-muted-foreground">
              Aquí puedes gestionar tus citas y acceder a tus datos de salud.
            </p>
          </div>
          <CerrarSesion />
        </header>

        <Separator className="my-6" />

        {/* SECCIÓN: Próximas Citas */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">
              Tus próximas citas
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citasProximas.map((cita) => (
              <Card 
                key={cita.id} 
                className="border-l-4 border-primary shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        <span>{formatDate(cita.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{cita.hora}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      {cita.doctor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cita.especialidad}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => joinVideoCall(cita.id)}
                  >
                    <Video className="w-4 h-4" />
                    Ingresar a la videollamada
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* SECCIÓN: Subir Comprobante */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <UploadCloud className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">
              Subir comprobante de pago
            </h2>
          </div>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label htmlFor="file-upload" className="text-sm font-medium text-foreground">
                      Seleccionar archivo
                    </label>
                    <Input 
                      id="file-upload"
                      type="file" 
                      className="w-full"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                    />
                  </div>
                  
                  <Button 
                    className="flex gap-2 min-w-[120px]"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    <UploadCloud className="w-4 h-4" />
                    {isUploading ? "Subiendo..." : "Subir"}
                  </Button>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-sm">
                      <FileImage className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200">
                        Archivo seleccionado: {selectedFile.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* SECCIÓN: Historial de Pagos */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">
              Historial de pagos
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historialPagos.map((pago) => (
              <Card key={pago.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{pago.descripcion}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(pago.fecha)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getEstadoColor(pago.estado)}`}>
                      <CheckCircle className="w-3 h-3" />
                      {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={pago.voucher}
                      alt={`Comprobante de pago - ${pago.descripcion}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      S/ {pago.monto.toFixed(2)}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Paciente;