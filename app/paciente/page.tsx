"use client";

import { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarDays, 
  Video, 
  UploadCloud, 
  Clock, 
  CheckCircle,
  FileImage,
  Calendar,
  Activity,
  History,
  Settings,
  Bell,
  Download,
  Eye,
  Phone,
  Mail
} from "lucide-react";
import Image from "next/image";

// Tipos de datos
interface Paciente {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  avatar?: string;
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  doctor: string;
  especialidad: string;
  estado: "confirmada" | "pendiente" | "completada";
  tipo: "online"; // Solo videollamadas
  ubicacion?: string;
}

interface Pago {
  id: number;
  fecha: string;
  monto: number;
  voucher: string;
  estado: "aprobado" | "pendiente" | "rechazado";
  descripcion: string;
  metodoPago: string;
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
      estado: "confirmada",
      tipo: "online",
      ubicacion: "Videollamada"
    },
    {
      id: 2,
      fecha: "2025-08-02",
      hora: "10:30",
      doctor: "Dr. Carlos Mendoza",
      especialidad: "Terapia Familiar",
      estado: "pendiente",
      tipo: "online",
      ubicacion: "Videollamada"
    }
  ];

  const historialPagos: Pago[] = [
    {
      id: 1,
      fecha: "2025-07-20",
      monto: 120.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1753067666/ljcukcivg7qgetcn80z4.png",
      estado: "aprobado",
      descripcion: "Consulta psicológica",
      metodoPago: "Transferencia bancaria"
    },
    {
      id: 2,
      fecha: "2025-07-15",
      monto: 150.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1701525535/cld-sample.jpg",
      estado: "aprobado",
      descripcion: "Terapia de pareja",
      metodoPago: "Yape"
    },
    {
      id: 3,
      fecha: "2025-07-10",
      monto: 180.00,
      voucher: "https://res.cloudinary.com/dp6slcmoi/image/upload/v1753300369/w0ggqmpkko45uhayznev.png",
      estado: "pendiente",
      descripcion: "Evaluación psicológica",
      metodoPago: "Plin"
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
            apellido: user.apellido,
            email: user.email || "paciente@contigo.voy",
            telefono: user.telefono || "+51 999 888 777",
            fechaNacimiento: user.fechaNacimiento || "1990-01-01"
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
      case 'completada':
        return 'text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'pendiente':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'rechazado':
        return 'text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const joinVideoCall = (citaId: number) => {
    // Lógica para unirse a la videollamada
    console.log("Unirse a videollamada de cita:", citaId);
    window.open(`/videocall/${citaId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        
        {/* SECCIÓN: Header con perfil mejorado */}
        <header className="relative rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-2xl"></div>
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
              {/* Información del perfil */}
              <div className="flex items-center gap-4 lg:gap-6">
                <Avatar className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-white dark:border-gray-700 shadow-lg">
                  <AvatarImage src={paciente?.avatar} alt={paciente?.nombre} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl lg:text-2xl font-bold">
                    {paciente?.nombre?.charAt(0)}{paciente?.apellido?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    Bienvenido{paciente ? `, ${paciente.nombre}` : ""}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 truncate">
                    {paciente?.apellido}
                  </p>
                  <div className="hidden sm:flex flex-wrap items-center gap-2 lg:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{paciente?.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{paciente?.telefono}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controles del usuario */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 w-full lg:w-auto">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 flex-1 sm:flex-none">
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Configuración</span>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 flex-1 sm:flex-none">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Notificaciones</span>
                  </Button>
                </div>
                <div className="w-full sm:w-auto relative z-[60]">
                  <CerrarSesion />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SECCIÓN: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próximas Citas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{citasProximas.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pagos Aprobados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {historialPagos.filter(p => p.estado === 'aprobado').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invertido</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    S/ {historialPagos.filter(p => p.estado === 'aprobado').reduce((sum, p) => sum + p.monto, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECCIÓN: Próximas Citas Mejoradas */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tus próximas citas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {citasProximas.map((cita) => (
              <Card 
                key={cita.id} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cita.doctor}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cita.especialidad}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{formatDate(cita.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{cita.hora}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <Video className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Videollamada en línea</span>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => joinVideoCall(cita.id)}
                    disabled={cita.estado !== 'confirmada'}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {cita.estado === 'confirmada' ? 'Ingresar a videollamada' : 'Cita pendiente de confirmación'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

        {/* SECCIÓN: Subir Comprobante Mejorado */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UploadCloud className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subir comprobante de pago
            </h2>
          </div>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                  <div className="lg:col-span-2 space-y-2">
                    <label htmlFor="file-upload" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seleccionar archivo
                    </label>
                    <div className="relative">
                      <Input 
                        id="file-upload"
                        type="file" 
                        className="w-full h-12 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Subir
                      </>
                    )}
                  </Button>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                        <FileImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Archivo seleccionado
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {selectedFile.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

        {/* SECCIÓN: Historial de Pagos Mejorado */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <History className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historial de pagos
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {historialPagos.map((pago) => (
              <Card 
                key={pago.id} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {pago.descripcion}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(pago.fecha)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {pago.metodoPago}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getEstadoColor(pago.estado)}`}>
                      <CheckCircle className="w-3 h-3" />
                      {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={pago.voucher}
                      alt={`Comprobante de pago - ${pago.descripcion}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="bg-white/90 text-gray-800">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      S/ {pago.monto.toFixed(2)}
                    </span>
                    <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <Download className="w-4 h-4 mr-1" />
                      Descargar
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