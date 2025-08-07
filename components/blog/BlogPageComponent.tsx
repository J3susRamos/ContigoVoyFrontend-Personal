"use client";
import { useState } from "react";
import { Authors, BlogPreviewData, Categoria } from "@/interface";
import { ArrowLeft, Filter } from "lucide-react";
import Image from "next/image";

// Hooks
import { useBlogFilters } from "./hooks/useBlogFilters";
import { useImageCarousel } from "./hooks/useImageCarousel";

// Components
import BlogAside from "./blogaside";
import BlogPreview from "./blogpreview";
import BlogHeader from "./components/BlogHeader";
import FilterTags from "./components/FilterTags";
import BlogCarousel from "./components/BlogCarousel";
import ImageModal from "./components/ImageModal";

export default function BlogPageComponent({
  Datos,
  Categories,
  Authors,
}: {
  Datos: BlogPreviewData[];
  Categories: Categoria[];
  Authors: Authors[];
}) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPreviewData | null>(
    null
  );
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

  const {
    currentImageIndex,
    isCarouselPlaying,
    showImageModal,
    modalImageIndex,
    nextImage,
    prevImage,
    goToImage,
    toggleCarousel,
    openImageModal,
    closeImageModal,
    nextModalImage,
    prevModalImage,
    setModalImageIndex,
  } = useImageCarousel(selectedBlog);

  const handleSelectBlog = (blog: BlogPreviewData) => {
    setSelectedBlog(blog);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {selectedBlog ? (
          /* Blog Individual View */
          <div className="max-w-4xl mx-auto">
            <button
              className="flex items-center gap-3 mb-8 text-[#634AE2] hover:text-[#4f46e5] transition-colors group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl"
              onClick={() => setSelectedBlog(null)}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver al blog</span>
            </button>

            <article className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              {/* Article Header */}
              <div className="bg-gradient-to-r from-[#634AE2] via-[#7c3aed] to-[#8b7cf6] p-8 lg:p-12 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <Image
                    src={selectedBlog.psicologoImagenId}
                    alt={selectedBlog.psicologo || "Avatar"}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white/30 shadow-lg"
                  />
                  <div>
                    <p className="font-semibold text-xl mb-1">
                      {selectedBlog.psicologo} {selectedBlog.psicologApellido}
                    </p>
                    <p className="text-white/80 text-sm">
                      Publicado el{" "}
                      {new Date(selectedBlog.fecha).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <h1 className="text-2xl lg:text-5xl font-bold leading-tight">
                  {selectedBlog.tema}
                </h1>
              </div>

              {/* Article Image(s) - Carrusel */}
              <BlogCarousel
                blog={selectedBlog}
                currentImageIndex={currentImageIndex}
                isCarouselPlaying={isCarouselPlaying}
                onNext={nextImage}
                onPrev={prevImage}
                onGoTo={goToImage}
                onToggle={toggleCarousel}
                onOpenModal={openImageModal}
              />

              {/* Article Content */}
              <div className="p-8 lg:p-12">
                <div
                  className="blog-preview  [&_a]:text-[#6228cb] [&_a]:font-bold dark:[&_a]:text-[#3498db] prose prose-lg lg:prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.contenido }}
                />
              </div>
            </article>
          </div>
        ) : (
          /* Blog List View */
          <>
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
                        <BlogPreview Data={item} onSelect={handleSelectBlog} />
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
          </>
        )}
      </div>

      {/* Modal para ver imagen completa */}
      <ImageModal
        blog={selectedBlog!}
        showModal={showImageModal}
        modalImageIndex={modalImageIndex}
        onClose={closeImageModal}
        onNext={nextModalImage}
        onPrev={prevModalImage}
        onGoTo={setModalImageIndex}
      />
    </div>
  );
}
