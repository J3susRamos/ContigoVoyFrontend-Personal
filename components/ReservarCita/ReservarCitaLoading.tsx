import { Skeleton } from "@heroui/react";

export default function ReservarCitaLoading() {
  const RenderFilterSection = () => (
    <Skeleton className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors duration-300">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"></h4>
      <div className="space-y-3 h-scv11"></div>
    </Skeleton>
  );

  const CardPreviewLoading = () => (
    <Skeleton className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 min-h-[320px]">
    </Skeleton>
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              La mejor inversión es en ti mismo
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
              ¡Comienza tu proceso hoy!
            </h2>

            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Agenda tu sesión con un psicólogo en línea, fácil, seguro y
              privado
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Profesionales certificados
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">100% confidencial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Primera sesión gratuita
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}{" "}
          <div className="lg:w-80 flex-shrink-0">
            <div className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Encuentra tu psicólogo ideal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filtra por tus preferencias
                </p>
              </div>
              {/* Mobile: Search and Filters button */}
              <div className="flex flex-col gap-4 sm:hidden ">
                <Skeleton className="relative rounded-xl">
                  <input
                    name="nombre"
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full  border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
                  />{" "}
                  <span
                    className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                    }}
                  />
                </Skeleton>{" "}
                <Skeleton className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl text-base font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full flex items-center justify-between gap-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] dark:shadow-purple-900/50">
                  <span>Filtros avanzados</span>
                </Skeleton>
              </div>{" "}
              {/* Desktop: Search only (filters always visible) */}
              <Skeleton className="hidden sm:block mb-6 rounded-xl">
                <div className="relative ">
                  <input className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full  border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300" />
                </div>
              </Skeleton>
              {/* Filters content */}
              <div className={`hidden sm:block space-y-6`}>
                {Array.from({ length: 4 }).map((Item, index) => (
                  <RenderFilterSection key={index} />
                ))}
              </div>
            </div>
          </div>
          {/* Grid de psicólogos */}
          <div className="flex-1">
            {
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {Array.from({ length: 6 }).map((Item, index) => (
                  <CardPreviewLoading key={index} />
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
