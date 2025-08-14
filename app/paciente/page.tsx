"use client"; // Indica a Next.js que este componente se renderiza en el cliente (usa hooks)

// Import de hooks de React para manejar estado, efectos y referencias a nodos DOM
import { useEffect, useState, useRef } from "react"; // useEffect: efectos; useState: estado; useRef: referencia mutable

// Import del componente para cerrar sesión (parte de tu librería interna)
import CerrarSesion from "@/components/CerrarSesion"; // Botón/acción de logout ya existente en el proyecto

// Import de componentes UI reutilizables (Shadcn/UI o equivalente)
import { Button } from "@/components/ui/button"; // Botón estilizado
import Input from "@/components/ui/input"; // Campo de entrada (no se usa en todas partes pero disponible)

// Import de componentes Card para agrupar contenido
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Contenedores/estructuras visuales

// Separador visual entre secciones
import { Separator } from "@/components/ui/separator"; // Línea separadora

// Avatar para mostrar imagen o iniciales del paciente
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Imagen de perfil

// Íconos de lucide-react usados en la UI
import { 
  CalendarDays, // Ícono de calendario (día)
  Video, // Ícono de videollamada
  UploadCloud, // Ícono de subir a la nube
  Clock, // Ícono de reloj
  CheckCircle, // Ícono de check/éxito
  FileImage, // Ícono de imagen/archivo
  Calendar, // Ícono de calendario genérico
  Activity, // Ícono de actividad/estadística
  History, // Ícono de historial
  Settings, // Ícono de ajustes
  Bell, // Ícono de notificaciones (no se usa en este snippet, pero disponible)
  Download, // Ícono de descarga
  Eye, // Ícono de ver/preview
  Phone, // Ícono de teléfono (no se usa aquí)
  Mail, // Ícono de correo (no se usa aquí)
  ChevronDown, // Ícono de desplegar hacia abajo
  ChevronUp, // Ícono de desplegar hacia arriba
  RefreshCw, // Ícono de recargar/rehacer (reagendar)
  Loader2, // Ícono spinner (cargando)
  X // Ícono de cerrar/eliminar
} from "lucide-react"; // Paquete de íconos

// Componente de imagen optimizada de Next.js
import Image from "next/image"; // Gestiona lazy-loading y optimización

// --------------------------
// Definición de tipos (TypeScript)
// --------------------------

// Interfaz del paciente: describe la forma de los datos que esperamos
interface Paciente {
  nombre: string; // Nombre del paciente
  apellido: string; // Apellido del paciente
  email?: string; // Email opcional
  telefono?: string; // Teléfono opcional
  fechaNacimiento?: string; // Fecha de nacimiento opcional
  avatar?: string; // URL de avatar opcional
}

// Interfaz de una cita
interface Cita {
  id: number; // ID único de la cita
  fecha: string; // Fecha (YYYY-MM-DD)
  hora: string; // Hora (HH:mm)
  doctor: string; // Nombre del profesional
  especialidad: string; // Especialidad
  estado: "confirmada" | "pendiente" | "completada"; // Estado de la cita
  tipo: "online"; // Tipo de cita (en este caso solo online)
  ubicacion?: string; // Ubicación opcional (p.ej. "Videollamada")
}

// Interfaz de un pago
interface Pago {
  id: number; // ID del pago
  fecha: string; // Fecha del pago
  monto: number; // Monto en número
  voucher: string; // URL del comprobante (imagen/pdf)
  estado: "aprobado" | "pendiente" | "rechazado"; // Estado del pago
  descripcion: string; // Descripción (concepto)
  metodoPago: string; // Método (Yape, Plin, transferencia, etc.)
}

// --------------------------
// Componente principal
// --------------------------
const Paciente = () => { // Declara el componente funcional Paciente
  // Estado con los datos del paciente; inicia como null hasta cargar
  const [paciente, setPaciente] = useState<Paciente | null>(null); // useState para guardar el paciente

  // Estado que guarda el archivo seleccionado (comprobante)
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // null si no hay archivo

  // Indicador de si hay una subida en progreso
  const [isUploading, setIsUploading] = useState(false); // true mientras se "sube" el archivo

  // Tipo de servicio/pago elegido para el comprobante
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null); // selecciona el tipo

  // IDs de citas/pagos actualmente expandidos (acordeón)
  const [expandedCitas, setExpandedCitas] = useState<number[]>([]); // lista de IDs de citas abiertas
  const [expandedPagos, setExpandedPagos] = useState<number[]>([]); // lista de IDs de pagos abiertos

  // Referencia a input type=file para poder abrirlo desde un botón si se desea
  const fileInputRef = useRef<HTMLInputElement | null>(null); // referencia mutable al input oculto

  // --------------------------
  // Datos de ejemplo (mock) — normalmente vendrían de una API
  // --------------------------
  const citasProximas: Cita[] = [ // Array de próximas citas simuladas
    {
      id: 1, // ID único
      fecha: "2025-07-28", // Fecha de la cita
      hora: "16:00", // Hora de la cita
      doctor: "Dra. María López", // Nombre del profesional
      especialidad: "Psicología Clínica", // Especialidad
      estado: "confirmada", // Estado actual
      tipo: "online", // Tipo (videollamada)
      ubicacion: "Videollamada" // Etiqueta de ubicación
    },
    {
      id: 2, // Segundo item de ejemplo
      fecha: "2025-08-02",
      hora: "10:30",
      doctor: "Dr. Carlos Mendoza",
      especialidad: "Terapia Familiar",
      estado: "pendiente",
      tipo: "online",
      ubicacion: "Videollamada"
    }
  ];

  // Historial de pagos de ejemplo (simulado)
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
    }
  ];

  // --------------------------
  // Efectos (useEffect)
  // --------------------------
  useEffect(() => { // Efecto que corre al montar el componente
    initializePaciente(); // Carga datos del paciente desde localStorage
  }, []); // [] asegura que solo se ejecute una vez (montaje)

  // --------------------------
  // Funciones auxiliares
  // --------------------------

  const initializePaciente = () => { // Lee localStorage y popula 'paciente'
    if (typeof window !== "undefined") { // Asegura que se ejecute en cliente
      const storedUser = localStorage.getItem("user"); // Obtiene la cadena JSON guardada
      if (storedUser) { // Si existe
        const user = JSON.parse(storedUser); // Parsea a objeto
        if (user.rol === "PACIENTE") { // Verifica rol
          setPaciente({ // Guarda en estado con valores por defecto
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => { // Maneja selección de archivo
    const file = event.target.files?.[0]; // Toma el primer archivo
    if (file) { // Si hay archivo
      setSelectedFile(file); // Lo guarda en estado
    }
  };

  const handleFileUpload = async () => { // Simula la subida del archivo
    if (!selectedFile) return; // Si no hay archivo, salir
    setIsUploading(true); // Activa spinner/bloquea botones
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2s (simulación de API)
      alert("Comprobante subido exitosamente"); // Notifica éxito (reemplazar por toast en prod)
      setSelectedFile(null); // Limpia el archivo
      setSelectedPaymentType(null); // Limpia el tipo seleccionado
    } catch (error) { // Captura errores
      console.error("Error al subir archivo:", error); // Log de error
      alert("Error al subir el comprobante"); // Notifica error
    } finally {
      setIsUploading(false); // Siempre apagar el estado de carga
    }
  };

  const formatDate = (dateString: string): string => { // Convierte fecha a formato legible ES
    const date = new Date(dateString); // Crea objeto Date
    return date.toLocaleDateString('es-ES', { // Formatea en español
      weekday: 'long', // Día de la semana
      year: 'numeric', // Año
      month: 'long', // Mes
      day: 'numeric' // Día
    });
  };

  const joinVideoCall = (citaId: number) => { // Abre la videollamada correspondiente
    window.open(`/videocall/${citaId}`, '_blank'); // Abre en nueva pestaña la ruta /videocall/:id
  };

  const handleReagendar = (cita: Cita) => { // Acción para reagendar (placeholder)
    alert(`Preparando para reagendar cita con ${cita.doctor} el ${cita.fecha} a las ${cita.hora}`); // Mensaje informativo
  };

  const toggleExpandCita = (id: number) => { // Alterna expansión de la cita (acordeón)
    setExpandedCitas(prev => // Usa estado previo
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id] // Quita si estaba, agrega si no
    );
  };

  const toggleExpandPago = (id: number) => { // Alterna expansión del pago (acordeón)
    setExpandedPagos(prev => // Usa estado previo
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id] // Quita/agrega id
    );
  };

  const getEstadoColor = (estado: string) => { // Devuelve clases según estado para estilos
    switch (estado) { // Compara estado
      case 'confirmada': // Cita confirmada
      case 'aprobado': // Pago aprobado
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'; // Verde
      case 'pendiente': // En espera
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500'; // Amarillo
      case 'rechazado': // Rechazado
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500'; // Rojo
      default: // Otro estado
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'; // Gris neutro
    }
  };

  // --------------------------
  // Render (JSX)
  // --------------------------
  return ( // Devuelve el árbol JSX a renderizar
    // Contenedor principal con gradiente de fondo y soporte para dark mode
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Contenedor central con padding y separación entre secciones */}
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        
        {/* Header superior con avatar y acciones */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          {/* Padding interno del header */}
          <div className="p-4 sm:p-6">
            {/* Layout del header: a la izquierda perfil, a la derecha acciones */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Bloque de perfil */}
              <div className="flex items-center gap-4">
                {/* Avatar con fallback a iniciales si no hay imagen */}
                <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-700">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {paciente?.nombre?.charAt(0)}{paciente?.apellido?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Nombre y apellidos del paciente */}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Bienvenido{paciente ? `, ${paciente.nombre}` : ""}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{paciente?.apellido}</p>
                </div>
              </div>
              {/* Acciones: configuración y cerrar sesión */}
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

        {/* Tarjetas de métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta 1: próximas citas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Próximas Citas</p>
                <p className="text-2xl font-bold">{citasProximas.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          {/* Tarjeta 2: pagos aprobados */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pagos Aprobados</p>
                <p className="text-2xl font-bold">
                  {historialPagos.filter(p => p.estado === 'aprobado').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          {/* Tarjeta 3: total invertido */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Invertido</p>
                <p className="text-2xl font-bold">
                  S/ {historialPagos.filter(p => p.estado === 'aprobado').reduce((sum, p) => sum + p.monto, 0).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------- SECCIÓN: Citas -------------------- */}
        <section>
          {/* Encabezado de la sección de citas */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Tus próximas citas</h2>
          </div>
          
          {/* Lista de tarjetas de citas con acordeón */}
          <div className="space-y-3">
            {citasProximas.map((cita) => (
              <Card key={cita.id} className="overflow-hidden">
                {/* Cabecera clickable del acordeón */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleExpandCita(cita.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getEstadoColor(cita.estado)}`}>
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cita.doctor}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cita.especialidad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${getEstadoColor(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                    {expandedCitas.includes(cita.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Contenido expandido de la cita */}
                {expandedCitas.includes(cita.id) && (
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        <span>{formatDate(cita.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{cita.hora}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Video className="w-4 h-4 text-purple-500" />
                      <span>Videollamada en línea</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full"
                        onClick={() => joinVideoCall(cita.id)}
                        disabled={cita.estado !== 'confirmada'}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {cita.estado === 'confirmada' ? 'Ingresar a videollamada' : 'Cita pendiente'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleReagendar(cita)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Volver a agendar
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* -------------------- SECCIÓN: Subir comprobante -------------------- */}
        <section>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UploadCloud className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold">Subir comprobante de pago</h2>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Citas</label>
                <select 
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                  value={selectedPaymentType || ''}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="consulta">Consulta Psicológica</option>
                  <option value="terapia">Terapia de Pareja</option>
                  <option value="evaluacion">Evaluación Psicológica</option>
                </select>
              </div>

              {selectedPaymentType && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comprobante</label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <input 
                        type="file" 
                        className="hidden" 
                        id="file-upload"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf"
                        ref={fileInputRef}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Haz clic para subir</span> o arrastra el archivo
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG o PDF (MAX. 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3">
                        <FileImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <Button 
                    className="w-full mt-2"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Subir comprobante
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <Separator className="my-6" />

        {/* -------------------- SECCIÓN: Historial de pagos -------------------- */}
        <section>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold">Historial de pagos</h2>
          </div>

          <div className="space-y-3">
            {historialPagos.map((pago) => (
              <Card key={pago.id}>
                {/* Cabecera clickable del pago */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleExpandPago(pago.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getEstadoColor(pago.estado)}`}>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{pago.descripcion}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(pago.fecha)} • {pago.metodoPago}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${getEstadoColor(pago.estado)}`}>
                      {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                    </span>
                    {expandedPagos.includes(pago.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Contenido expandido del pago */}
                {expandedPagos.includes(pago.id) && (
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={pago.voucher}
                        alt={`Comprobante de pago - ${pago.descripcion}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        S/ {pago.monto.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(pago.voucher, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a'); // Crea un elemento <a>
                            link.href = pago.voucher; // Asigna el origen del archivo
                            link.download = `comprobante-${pago.id}.${pago.voucher.split('.').pop()}`; // Sugiere nombre de descarga
                            link.click(); // Dispara la descarga
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Paciente; // Exporta el componente como default para poder importarlo en otras rutas
