"use client";
import BlogAside from "./blogaside";
import BlogPreview from "./blogpreview";
import { Authors, BlogPreviewData, Categoria } from "@/interface";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import "./styles/blogStyles.css";

export default function BlogPageComponent({
  Datos,
  Categories,
  Authors
}: {
  Datos: BlogPreviewData[];
  Categories: Categoria[];
  Authors: Authors[];
}) {  const [filteredData, setFilteredData] = useState<BlogPreviewData[]>(Datos);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeAuthor, setActiveAuthor] = useState<number | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPreviewData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  // Estados para el carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  // Carrusel automático
  useEffect(() => {
    if (!selectedBlog?.imagenes || selectedBlog.imagenes.length <= 1 || !isCarouselPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
      );
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [selectedBlog, isCarouselPlaying]);  // Manejo de teclado para el modal
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
        setIsCarouselPlaying(true);
      } else if (e.key === 'ArrowLeft' && selectedBlog?.imagenes) {
        setModalImageIndex((prev) => 
          prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' && selectedBlog?.imagenes) {
        setModalImageIndex((prev) => 
          prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, selectedBlog]);

  // Funciones del carrusel
  const nextImage = () => {
    if (!selectedBlog?.imagenes) return;
    setCurrentImageIndex((prev) => 
      prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedBlog?.imagenes) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  const toggleCarousel = () => {
    setIsCarouselPlaying(!isCarouselPlaying);
  };  // Funciones del modal con useCallback para optimización
  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
    setIsCarouselPlaying(false); // Pausar carrusel cuando se abre modal
  };

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
    setIsCarouselPlaying(true); // Reanudar carrusel cuando se cierra modal
  }, []);

  const nextModalImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setModalImageIndex((prev) => 
      prev === selectedBlog.imagenes!.length - 1 ? 0 : prev + 1
    );
  }, [selectedBlog?.imagenes]);

  const prevModalImage = useCallback(() => {
    if (!selectedBlog?.imagenes) return;
    setModalImageIndex((prev) => 
      prev === 0 ? selectedBlog.imagenes!.length - 1 : prev - 1
    );
  }, [selectedBlog?.imagenes]);

  // Función para aplicar filtros
  const applyFilters = (search = searchTerm, categoryId = activeCategory, authorId = activeAuthor) => {
    let filtered = [...Datos];

    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter(blog => 
        blog.tema.toLowerCase().includes(search.toLowerCase()) ||
        blog.contenido.toLowerCase().includes(search.toLowerCase()) ||
        blog.psicologo?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoryId) {
      const categoryName = Categories.find(cat => cat.idCategoria === categoryId)?.nombre;
      filtered = filtered.filter(blog => blog.categoria === categoryName);
    }

    // Filtro por autor
    if (authorId) {
      const author = Authors.find(a => a.id === authorId);
      filtered = filtered.filter(blog => blog.psicologo?.includes(author?.name || ''));
    }

    setFilteredData(filtered);
  };

  const handleCategoryFilter = (categoryId: number) => {
    const newCategoryId = activeCategory === categoryId ? null : categoryId;
    setActiveCategory(newCategoryId);
    applyFilters(searchTerm, newCategoryId, activeAuthor);
  };

  const handleAuthorFilter = (authorId: number) => {
    const newAuthorId = activeAuthor === authorId ? null : authorId;
    setActiveAuthor(newAuthorId);
    applyFilters(searchTerm, activeCategory, newAuthorId);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, activeCategory, activeAuthor);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveCategory(null);
    setActiveAuthor(null);
    setFilteredData(Datos);
  };
  const handleSelectBlog = (blog: BlogPreviewData) => {
    setSelectedBlog(blog);
    setCurrentImageIndex(0); // Resetear carrusel al seleccionar nuevo blog
    setIsCarouselPlaying(true); // Activar carrusel automático
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
                Blog
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                Descubre artículos sobre bienestar mental, desarrollo personal y salud emocional escritos por nuestros especialistas.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tags */}
          {(activeCategory || activeAuthor || searchTerm) && (
            <div className="flex flex-wrap items-center gap-3 mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtros activos:</span>
              {activeCategory && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
                  {Categories.find(cat => cat.idCategoria === activeCategory)?.nombre}
                  <button 
                    onClick={() => handleCategoryFilter(activeCategory)} 
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeAuthor && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
                  {Authors.find(a => a.id === activeAuthor)?.name}
                  <button 
                    onClick={() => handleAuthorFilter(activeAuthor)} 
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
                  &ldquo;{searchTerm}&rdquo;
                  <button 
                    onClick={() => handleSearch("")} 
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#634AE2] hover:text-[#4f46e5] underline font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}

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
        </div>

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
                      Publicado el {new Date(selectedBlog.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <h1 className="text-2xl lg:text-5xl font-bold leading-tight">
                  {selectedBlog.tema}
                </h1>
              </div>              {/* Article Image(s) - Carrusel */}
              <div className="relative overflow-hidden">
                {selectedBlog.imagenes && selectedBlog.imagenes.length > 1 ? (
                  // Carrusel de múltiples imágenes
                  <div className="relative h-80 lg:h-[500px] overflow-hidden">
                    {/* Imagen actual */}
                    <div className="relative h-full">
                      <Image
                        src={selectedBlog.imagenes[currentImageIndex]}
                        alt={`Imagen ${currentImageIndex + 1} de ${selectedBlog.tema}`}
                        title={selectedBlog.tema}
                        fill
                        className="object-contain bg-gray-100 dark:bg-gray-800 transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        priority={currentImageIndex === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Controles del carrusel */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {/* Botón anterior */}
                      <button
                        onClick={prevImage}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </button>
                      
                      {/* Botón siguiente */}
                      <button
                        onClick={nextImage}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        <ChevronRight className="w-7 h-7" />
                      </button>
                    </div>

                    {/* Indicadores de página */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                      {selectedBlog.imagenes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'w-4 h-4 bg-white scale-110 shadow-lg' 
                              : 'w-3 h-3 bg-white/60 hover:bg-white/90 hover:scale-105'
                          } rounded-full backdrop-blur-sm`}
                        />
                      ))}
                    </div>

                    {/* Control de play/pause */}
                    <div className="absolute top-6 right-6">
                      <button
                        onClick={toggleCarousel}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110"
                        title={isCarouselPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
                      >
                        {isCarouselPlaying ? (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-1.5 h-4 bg-white mr-1"></div>
                            <div className="w-1.5 h-4 bg-white"></div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Contador de imágenes */}
                    <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
                      {currentImageIndex + 1} de {selectedBlog.imagenes.length}
                    </div>                    {/* Botón para ver imagen completa */}
                    <div className="absolute bottom-6 right-6">
                      <button
                        onClick={() => openImageModal(currentImageIndex)}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
                      >
                        Ver completa
                      </button>
                    </div>
                  </div>
                ) : (
                  // Imagen única (compatibilidad hacia atrás)
                  <div className="relative h-80 lg:h-[500px] overflow-hidden">
                    <Image
                      src={selectedBlog.imagenes?.[0] || selectedBlog.imagen}
                      alt={`Imagen de ${selectedBlog.tema}`}
                      title={selectedBlog.tema}
                      fill
                      className="object-contain bg-gray-100 dark:bg-gray-800"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      {/* Botón para ver imagen completa */}
                    <div className="absolute bottom-6 right-6">
                      <button
                        onClick={() => openImageModal(0)}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
                      >
                        Ver completa
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-8 lg:p-12">
                <div 
                  className="blog-preview prose prose-lg lg:prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.contenido }}
                />
              </div>
            </article>
          </div>
        ) : (
          /* Blog List View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Desktop */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10">
                  <BlogAside
                    Categories={Categories}
                    Authors={Authors}
                    onCategoryClick={handleCategoryFilter}
                    onAuthorClick={handleAuthorFilter}
                    activeCategory={activeCategory}
                    activeAuthor={activeAuthor}
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {filteredData.length > 0 ? (
                <div className="space-y-8">
                  {filteredData.map((item) => (
                    <div key={item.idBlog} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10">
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
                      No hay artículos que coincidan con los filtros seleccionados.
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
          </div>        )}
      </div>

      {/* Modal para ver imagen completa */}
      {showImageModal && selectedBlog?.imagenes && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Contenido del modal */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Imagen */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedBlog.imagenes[modalImageIndex]}
                alt={`Imagen ${modalImageIndex + 1} de ${selectedBlog.tema}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Botón cerrar */}
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 bg-black/60 hover:bg-red-600/80 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Controles del modal (solo si hay múltiples imágenes) */}
            {selectedBlog.imagenes.length > 1 && (
              <>
                {/* Botón anterior */}
                <button
                  onClick={prevModalImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Botón siguiente */}
                <button
                  onClick={nextModalImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Contador */}
                <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg z-10">
                  {modalImageIndex + 1} de {selectedBlog.imagenes.length}
                </div>

                {/* Indicadores de página */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                  {selectedBlog.imagenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setModalImageIndex(index)}
                      className={`transition-all duration-300 ${
                        index === modalImageIndex 
                          ? 'w-4 h-4 bg-white scale-110 shadow-lg' 
                          : 'w-3 h-3 bg-white/60 hover:bg-white/90 hover:scale-105'
                      } rounded-full backdrop-blur-sm`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Información de la imagen */}
            <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg z-10">
              Clic fuera para cerrar
            </div>
          </div>

          {/* Overlay para cerrar */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeImageModal}
          />
        </div>
      )}
    </div>
  );
}