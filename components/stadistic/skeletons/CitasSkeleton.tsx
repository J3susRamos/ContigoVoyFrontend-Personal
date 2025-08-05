import { Skeleton } from "@heroui/react";

function CitasSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

      {/* Cards de información */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-6">
          <Skeleton className="w-6 h-6 bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-6">
          <Skeleton className="w-6 h-6 bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="h-5 w-36 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* LineChart */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          <div className="rounded-r-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-44 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            <div className="w-full h-full bg-muted/30 rounded animate-pulse relative">
              <div className="absolute bottom-8 left-8 right-8 top-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path d="M10,60 L25,45 L40,70 L55,30 L70,50 L85,25" stroke="#7777FF" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* PieChart */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          <div className="rounded-r-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary/20 mb-4 flex items-center justify-center">
            <Skeleton className="h-6 w-28 bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] rounded-full bg-muted animate-pulse relative">
              <div className="absolute top-[25%] left-[25%] w-[75px] md:w-[100px] h-[75px] md:h-[100px] bg-background rounded-full"></div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 place-items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitasSkeleton;