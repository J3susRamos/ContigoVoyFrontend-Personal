import { Skeleton } from "@heroui/react";
import ViewLoadingSkeleton from "./ViewLoadingSkeleton";

export default function LoadingSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header Skeleton */}
      <header className="w-full bg-gradient-to-r from-primary to-primary/90 dark:from-primary dark:to-primary/80 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Botones Skeleton */}
            <nav className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 md:h-11 w-24 md:w-32 rounded-full bg-white/20" />
              ))}
            </nav>
            {/* Filtro Skeleton */}
            <div className="flex justify-center md:justify-end">
              <Skeleton className="h-10 w-48 rounded-lg bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Skeleton */}
      <main className="px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px] overflow-hidden">
          <div className="p-6 md:p-8">
            <ViewLoadingSkeleton viewKey={"clientes"} />
          </div>
        </div>
      </main>
    </div>
  );
}