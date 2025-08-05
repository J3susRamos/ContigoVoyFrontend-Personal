import { Skeleton } from "@heroui/react";

function ClientesSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Filtro de edad */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-10 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Grid principal - Una columna en móvil, dos en desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

        {/* Gráfico de Género - PieChart */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          {/* Header del gráfico */}
          <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Gráfico circular */}
          <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
            <div className="w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-full bg-muted animate-pulse relative">
              <div className="absolute top-[25%] left-[25%] w-[100px] md:w-[125px] h-[100px] md:h-[125px] bg-background rounded-full"></div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-6 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha - Gráficos de Edad y Lugar */}
        <div className="flex flex-col gap-6">

          {/* Gráfico de Edad */}
          <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
            <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
              <Skeleton className="h-6 w-20 bg-gray-300 dark:bg-gray-600" />
            </div>

            <div className="w-full h-[250px] md:h-[280px] flex items-center justify-center">
              <div className="w-full h-full bg-muted/30 rounded animate-pulse flex items-end justify-around p-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`bg-primary/20 rounded-t w-8 md:w-12`} style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de Lugar */}
          <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
            <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
              <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-600" />
            </div>

            <div className="w-full h-[250px] md:h-[280px] flex items-center justify-center">
              <div className="w-full h-full bg-muted/30 rounded animate-pulse flex items-end justify-around p-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`bg-primary/20 rounded-t w-12 md:w-16`} style={{ height: `${Math.random() * 70 + 15}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientesSkeleton;