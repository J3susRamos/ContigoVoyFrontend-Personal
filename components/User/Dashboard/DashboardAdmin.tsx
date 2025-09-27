"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  UserCheck,
  UserX,
  CreditCard,
  Activity,
  TrendingUp,
  DollarSign,
  FileText
} from "lucide-react";
import Link from "next/link";
import { 
  GetWorkersStats, 
  GetCitasEstadisticas, 
  GetCitasSinPagarDashboard, 
  GetCitasPagadasDashboard 
} from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";

interface CitaSimple {
  idCita: string;
  fecha_cita: string;
  estado_Cita: string;
  paciente: {
    nombre: string;
    apellido: string;
  };
}

interface AdminDashboardStats {
  citas: {
    sin_pagar: number;
    pendientes: number;
    canceladas: number;
    realizadas: number;
    ausentes: number;
    reprogramadas: number;
  };
  trabajadores: {
    [role: string]: {
      total: number;
      activos: number;
      inactivos: number;
    };
  };
  citasSinPagar: CitaSimple[];
  citasPagadas: CitaSimple[];
}

export default function DashboardAdmin() {
  console.log("🔍 DashboardAdmin component is rendering");
  
  const [stats, setStats] = useState<AdminDashboardStats>({
    citas: {
      sin_pagar: 0,
      pendientes: 0,
      canceladas: 0,
      realizadas: 0,
      ausentes: 0,
      reprogramadas: 0
    },
    trabajadores: {},
    citasSinPagar: [],
    citasPagadas: []
  });
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Función para actualizar la hora
  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setCurrentTime(timeString);
  };

  // Effect para actualizar la hora
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar todas las estadísticas en paralelo
        const [citasStats, workersStats, citasSinPagar, citasPagadas] = await Promise.all([
          GetCitasEstadisticas().catch((error) => {
            console.error("Error loading citas stats:", error);
            return { sin_pagar: 0, pendientes: 0, canceladas: 0, realizadas: 0, ausentes: 0, reprogramadas: 0 };
          }),
          GetWorkersStats().catch((error) => {
            console.error("Error loading workers stats:", error);
            return { result: {} };
          }),
          GetCitasSinPagarDashboard().catch((error) => {
            console.error("Error loading citas sin pagar:", error);
            return { result: [] };
          }),
          GetCitasPagadasDashboard().catch((error) => {
            console.error("Error loading citas pagadas:", error);
            return { result: [] };
          })
        ]);

        console.log("📊 Loaded dashboard data:", { citasStats, workersStats, citasSinPagar, citasPagadas });

        setStats({
          citas: citasStats,
          trabajadores: workersStats.result,
          citasSinPagar: citasSinPagar.result || [],
          citasPagadas: citasPagadas.result || []
        });
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#020202] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6364F4]"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#020202] min-h-screen">
      {/* Header con saludo y hora */}
      <div className="flex flex-col md:flex-row justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-4 md:mb-0">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border-l-4 border-purple-600">
            <h1 className="text-2xl md:text-3xl font-bold text-purple-800 dark:text-white mb-2 flex items-center gap-2">
              <Activity className="w-8 h-8 text-purple-600" />
              Dashboard Administrativo
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Panel de control general del sistema - Vista completa de la plataforma
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Reloj */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-purple-200 dark:border-gray-500">
            <Clock className="h-5 w-5 text-[#6364F4]" />
            <span className="font-mono text-lg font-medium text-gray-900 dark:text-white">
              {currentTime}
            </span>
          </div>
          
          {/* Botón cerrar sesión solo en desktop */}
          <div className="hidden md:block">
            <CerrarSesion />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas principales estilo psicólogo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta principal de resumen - estilo similar al dashboard del psicólogo */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#E7E7FF] to-[#F5F5FF] dark:from-[#19191a] dark:to-[#2a2a2b] rounded-3xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
            <div className="flex items-center rounded-r-full py-4 px-6 text-[#fff] bg-gradient-to-r from-[#6364F4] to-[#7C7CF5] justify-between font-medium text-xl w-4/5 shadow-lg mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                <span>Estadísticas de Citas</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Citas Sin Pagar */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-700">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sin Pagar</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{stats.citas.sin_pagar}</p>
                </div>
              </div>

              {/* Citas Pendientes */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-yellow-200 dark:border-yellow-700">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                  <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.citas.pendientes}</p>
                </div>
              </div>

              {/* Citas Realizadas */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-green-200 dark:border-green-700">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Realizadas</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">{stats.citas.realizadas}</p>
                </div>
              </div>

              {/* Citas Canceladas */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                  <UserX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Canceladas</p>
                  <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{stats.citas.canceladas}</p>
                </div>
              </div>

              {/* Citas Ausentes */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-orange-200 dark:border-orange-700">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ausentes</p>
                  <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{stats.citas.ausentes}</p>
                </div>
              </div>

              {/* Citas Reprogramadas */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-200 dark:border-blue-700">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reprogramadas</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.citas.reprogramadas}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta personal activo - estilo similar al dashboard del psicólogo */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-3xl text-center shadow-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-green-200 dark:bg-green-700 p-3 rounded-full">
                <Users className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="font-medium text-lg text-green-700 dark:text-green-300 mb-2">Personal Activo</div>
            <div className="font-bold text-5xl text-green-800 dark:text-green-200">
              {Object.values(stats.trabajadores).reduce((total, role) => total + role.activos, 0)}
            </div>
            <Link 
              href="/user/trabajadores" 
              className="inline-block mt-2 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Gestionar personal →
            </Link>
          </div>
        </div>

        {/* Detalles por rol de trabajadores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#6364F4]" />
              Personal por Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.trabajadores).map(([role, data]) => (
                <div key={role} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize text-lg">
                      {role.toLowerCase()}
                    </h4>
                    <div className="bg-[#6364F4] text-white px-3 py-1 rounded-full text-lg font-bold">
                      {data.total}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Activos: {data.activos}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <UserX className="h-4 w-4" />
                      <span className="font-medium">Inactivos: {data.inactivos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de citas recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Citas Sin Pagar Recientes */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <DollarSign className="h-5 w-5" />
                Citas Sin Pagar Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {stats.citasSinPagar.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {stats.citasSinPagar.slice(0, 5).map((cita: CitaSimple, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {cita.paciente?.nombre} {cita.paciente?.apellido}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(cita.fecha_cita).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 rounded-full">
                          {cita.estado_Cita}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">¡Excelente! No hay citas sin pagar</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href="/user/citas-sin-pagar" 
                  className="flex items-center gap-2 text-red-600 hover:underline font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Ver todas las citas sin pagar →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Citas Pagadas Recientes */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CreditCard className="h-5 w-5" />
                Citas Pagadas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {stats.citasPagadas.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {stats.citasPagadas.slice(0, 5).map((cita: CitaSimple, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {cita.paciente?.nombre} {cita.paciente?.apellido}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(cita.fecha_cita).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 rounded-full">
                          {cita.estado_Cita}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500">No hay citas pagadas recientes</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href="/user/citas-pagadas" 
                  className="flex items-center gap-2 text-green-600 hover:underline font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Ver todas las citas pagadas →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-purple-200 dark:border-purple-800 hover:border-purple-300">
            <Link href="/user/pacientes">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#6364F4]">
                  <Users className="h-5 w-5" />
                  Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestionar pacientes del sistema
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-200 dark:border-blue-800 hover:border-blue-300">
            <Link href="/user/estadisticas">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Activity className="h-5 w-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reportes del sistema
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-green-200 dark:border-green-800 hover:border-green-300">
            <Link href="/user/calendario">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Calendar className="h-5 w-5" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ver agenda del sistema
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-orange-200 dark:border-orange-800 hover:border-orange-300">
            <Link href="/user/psicologos">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <UserCheck className="h-5 w-5" />
                  Psicólogos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestionar psicólogos
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Botón cerrar sesión en mobile */}
        <div className="md:hidden flex justify-center">
          <CerrarSesion />
        </div>
      </div>
    </div>
  );
}