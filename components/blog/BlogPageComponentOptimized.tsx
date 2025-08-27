"use client";
import { useState } from "react";
import { Authors, BlogPreviewData, Categoria } from "@/interface";
import { Filter } from "lucide-react";
// Hooks
import { useBlogFilters } from "./hooks/useBlogFilters";
// Components
import BlogAside from "./blogaside";
import BlogPreview from "./blogpreview";
import BlogHeader from "./components/BlogHeader";
import FilterTags from "./components/FilterTags";

export default function BlogPageComponent({
  Datos,
  Categories,
  Authors,
}: {
  Datos: BlogPreviewData[];
  Categories: Categoria[];
  Authors: Authors[];
}) {
  const [showFilters, setShowFilters] = useState(false);
  
  // Custom hooks
  const {
    filteredData,
    activeCategories,
    activeAuthors,
    searchTerm,
    handleCategoryFilter,
    handleAuthorFilter,
    handleSearch,
    clearAllFilters,
  } = useBlogFilters(Datos, Categories, Authors);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Blog List View - Siempre visible ahora */}
        <BlogHeader searchTerm={searchTerm} onSearch={handleSearch} />

        <FilterTags
          activeCategories={activeCategories}
          activeAuthors={activeAuthors}
          searchTerm={searchTerm}
          Categories={Categories}
          Authors={Authors}
          onCategoryFilter={handleCategoryFilter}
          onAuthorFilter={handleAuthorFilter}
          onSearch={handleSearch}
          onClearAll={clearAllFilters}
        />

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            Filtros
            <span className="ml-1 px-2 py-1 bg-white/20 rounded-full text-xs">
              {Categories.length}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="sticky top-6">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10">
                <BlogAside
                  Categories={Categories}
                  Authors={Authors}
                  onCategoryClick={handleCategoryFilter}
                  onAuthorClick={handleAuthorFilter}
                  activeCategories={activeCategories}
                  activeAuthors={activeAuthors}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredData.length > 0 ? (
              <div className="space-y-8">
                {filteredData.map((item) => (
                  <div
                    key={item.idBlog}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10"
                  >
                    <BlogPreview Data={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-[#634AE2]/10">
                  <div className="text-8xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                    No se encontraron artículos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                    No hay artículos que coincidan con los filtros
                    seleccionados.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-4 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
                  >
                    Ver todos los artículos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
