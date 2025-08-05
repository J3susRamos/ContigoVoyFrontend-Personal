import { Skeleton } from "@heroui/react";

function RendimientoSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-card dark:bg-card rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">

        {/* Rendimiento del equipo - LineChart */}
        <div className="flex flex-col">
          <div className="rounded-r-full w-full max-w-[350px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-40 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
            <div className="w-full h-full bg-muted/30 rounded animate-pulse relative">
              <div className="absolute bottom-8 left-8 right-8 top-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path d="M10,70 L25,50 L40,60 L55,35 L70,45 L85,20" stroke="#7777FF" strokeWidth="2" fill="none" opacity="0.3" />
                  <path d="M10,80 L25,65 L40,75 L55,50 L70,60 L85,40" stroke="#58A6FF" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Citas atendidas - PieChart */}
        <div className="flex flex-col items-center">
          <div className="rounded-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-48 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            <div className="w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-full bg-muted animate-pulse relative">
              <div className="absolute top-[25%] left-[25%] w-[100px] md:w-[125px] h-[100px] md:h-[125px] bg-background rounded-full"></div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 justify-center lg:justify-start">
                <Skeleton className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Rendimiento */}
      <div className="w-full bg-card dark:bg-card rounded-2xl overflow-hidden">
        <div className="w-full bg-primary/20 p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <Skeleton className="h-6 w-24 mx-auto bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="h-6 w-32 mx-auto bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>

        <div className="w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`grid grid-cols-2 gap-4 items-center p-4 ${i !== 3 ? "border-b border-muted" : ""}`}>
              <Skeleton className="h-5 w-24 mx-auto bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-5 w-8 mx-auto bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>

        <div className="bg-muted/30 dark:bg-muted/30 p-4">
          <Skeleton className="h-4 w-48 mx-auto bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default RendimientoSkeleton;