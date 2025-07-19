import { Skeleton } from "@heroui/react";

export default function ReservarCitaLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 lg:py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
                            Reservar Cita
                        </h1>
                        <p className="text-gray-600 dark:text-gray-900 text-lg max-w-2xl">
                            Encuentra y reserva una cita con nuestros psicólogos especializados.
                        </p>
                    </div>
                    {/* Search Bar Skeleton */}
                    <div className="relative lg:w-96">
                        <Skeleton className="w-full h-12 rounded-2xl" />
                    </div>
                </div>
            </div>        {/* Filters Section Skeleton */}
        <div className="mb-8">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Psychologists Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-[#634AE2]/10">
                    {/* Profile Image Skeleton */}
                    <div className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        
                        {/* Name and Title Skeleton */}
                        <Skeleton className="h-6 w-48 mx-auto mb-2 rounded" />
                        <Skeleton className="h-4 w-32 mx-auto mb-4 rounded" />
                        
                        {/* Description Skeleton */}
                        <div className="space-y-2 mb-4">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-3/4 mx-auto rounded" />
                            <Skeleton className="h-4 w-1/2 mx-auto rounded" />
                        </div>
                        
                        {/* Specialties Tags Skeleton */}
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-6 w-20 rounded-full" />
                            ))}
                        </div>
                        
                        {/* Rating Skeleton */}
                        <div className="flex justify-center items-center mb-4">
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                        
                        {/* Price Skeleton */}
                        <Skeleton className="h-6 w-20 mx-auto mb-4 rounded" />
                        
                        {/* Button Skeleton */}
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-10 rounded-lg" />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}