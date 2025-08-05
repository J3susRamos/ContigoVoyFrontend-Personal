import { Skeleton } from "@heroui/react";
import ClientesSkeleton from "./ClientesSkeleton";
import CitasSkeleton from "./CitasSkeleton";
import VentasSkeleton from "./VentasSkeleton";
import RendimientoSkeleton from "./RendimientoSkeleton";

function ViewLoadingSkeleton({ viewKey }: { viewKey: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header de sección */}
      <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <Skeleton className="h-8 w-80 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-96 bg-gray-100 dark:bg-gray-600" />
      </div>
      <div className="mt-6">
        {viewKey === "clientes" && <ClientesSkeleton />}
        {viewKey === "citas" && <CitasSkeleton />}
        {viewKey === "ventas" && <VentasSkeleton />}
        {viewKey === "rendimiento" && <RendimientoSkeleton />}
      </div>
    </div>
  );
}

export default ViewLoadingSkeleton;