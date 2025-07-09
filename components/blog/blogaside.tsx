import { Authors, Categoria } from "@/interface";
import { Avatar, Button } from "@heroui/react";
import { Tag, Users, TrendingUp, BarChart3 } from "lucide-react";

export default function BlogAside({
  Categories,
  Authors,
  onCategoryClick,
  onAuthorClick,
  activeCategories,
  activeAuthors
}: {
  Categories: Categoria[];
  Authors: Authors[];
  onCategoryClick: (categoryId: number) => void;
  onAuthorClick: (authorId: number) => void;
  activeCategories: number[];
  activeAuthors: number[];
}) {
  const authorsArray = Array.isArray(Authors) ? Authors : [];

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            Categorías
          </h3>
        </div>
          <div className="space-y-3">
          {Categories?.map((item) => {
            const isActive = activeCategories.includes(item.idCategoria);
            return (
              <Button
                key={item.idCategoria}
                variant={isActive ? "solid" : "bordered"}
                className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                    : "bg-white/80 border-[#634AE2]/40 text-[#634AE2] dark:bg-gray-700/80 dark:text-gray-200 dark:border-gray-500 hover:bg-gradient-to-r hover:from-[#634AE2]/20 hover:to-[#8b7cf6]/20 hover:border-[#634AE2] backdrop-blur-sm font-semibold"
                }`}
                onPress={() => onCategoryClick(item.idCategoria)}
                radius="lg"
                size="lg"
              >
                <span className="truncate font-medium">{item.nombre}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Authors Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#634AE2] dark:text-primary">
            Nuestros Especialistas
          </h3>
        </div>
          <div className="space-y-3">
          {authorsArray.length > 0 ? (
            authorsArray.map((item) => {
              const isActive = activeAuthors.includes(item.id);
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "solid" : "bordered"}
                  className={`w-full justify-start text-left p-4 transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white shadow-lg shadow-[#634AE2]/25"
                      : "bg-white/80 border-[#634AE2]/40 text-[#634AE2] dark:bg-gray-700/80 dark:text-gray-200 dark:border-gray-500 hover:bg-gradient-to-r hover:from-[#634AE2]/20 hover:to-[#8b7cf6]/20 hover:border-[#634AE2] backdrop-blur-sm font-semibold"
                  }`}
                  onPress={() => onAuthorClick(item.id)}
                  radius="lg"
                  startContent={
                    <Avatar 
                      src={item.photo} 
                      size="md"
                      className="ring-2 ring-white/50"
                    />
                  }
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold truncate text-base">
                      {item.name} {item.lastname}
                    </span>
                    <span className={`text-xs ${
                      isActive 
                        ? "text-white/80" 
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      Psicólogo Especialista
                    </span>
                  </div>
                </Button>
              );
            })
          ) : (
            <div className="text-center py-8 bg-white/50 rounded-xl border border-[#634AE2]/20">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay autores disponibles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Blog Stats */}
      <div className="bg-gradient-to-br from-[#634AE2]/10 via-[#8b7cf6]/10 to-[#634AE2]/5 rounded-2xl p-6 border border-[#634AE2]/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-[#634AE2] dark:text-primary">
            Estadísticas
          </h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#634AE2]" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Artículos</span>
            </div>
            <span className="font-bold text-[#634AE2] dark:text-primary text-lg">
              {Categories.length > 0 ? "20+" : "0"}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-[#634AE2]" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Categorías</span>
            </div>
            <span className="font-bold text-[#634AE2] dark:text-primary text-lg">
              {Categories.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#634AE2]" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Especialistas</span>
            </div>
            <span className="font-bold text-[#634AE2] dark:text-primary text-lg">
              {authorsArray.length}
            </span>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] rounded-xl text-center">
          <p className="text-white font-medium text-sm mb-2">
            ¿Necesitas ayuda profesional?
          </p>
          <button className="w-full px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            Reservar Cita
          </button>
        </div>
      </div>
    </div>
  );
}