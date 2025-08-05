import { Skeleton } from "@heroui/react";

function VentasSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Gráfico de Ingresos - LineChart (2 columnas) */}
        <div className="lg:col-span-2 w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          <div className="rounded-r-full w-full max-w-[350px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-48 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
            <div className="w-full h-full bg-muted/30 rounded animate-pulse relative">
              {/* Línea simulada */}
              <div className="absolute bottom-8 left-8 right-8 top-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path d="M10,80 Q30,20 50,40 T90,30" stroke="#7777FF" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de Citas - PieChart */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-32 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] rounded-full bg-muted animate-pulse relative">
              <div className="absolute top-[25%] left-[25%] w-[75px] md:w-[100px] h-[75px] md:h-[100px] bg-background rounded-full"></div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de Resumen Financiero */}
        <div className="lg:col-span-3 w-full bg-card dark:bg-card rounded-2xl overflow-hidden">
          <div className="w-full bg-primary/20 p-4">
            <div className="hidden md:grid md:grid-cols-5 gap-4 text-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 bg-gray-300 dark:bg-gray-600" />
              ))}
            </div>
            <div className="md:hidden text-center">
              <Skeleton className="h-6 w-48 mx-auto bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>
          <div className="p-4 min-h-[120px] flex items-center justify-center">
            <Skeleton className="h-4 w-80 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VentasSkeleton;