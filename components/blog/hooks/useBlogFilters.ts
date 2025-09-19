import { useState, useCallback, useEffect } from "react";
import { BlogPreviewData, Categoria, Authors } from "@/interface";

export const useBlogFilters = (Datos: BlogPreviewData[], Categories: Categoria[], Authors: Authors[]) => {
  console.log('🔍 [useBlogFilters] Hook inicializado con:');
  console.log('  - Datos:', Datos);
  console.log('  - Datos length:', Datos?.length);
  console.log('  - Categories:', Categories);
  console.log('  - Authors:', Authors);
  
  const [filteredData, setFilteredData] = useState<BlogPreviewData[]>(Datos);
  const [activeCategories, setActiveCategories] = useState<number[]>([]);
  const [activeAuthors, setActiveAuthors] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Efecto para sincronizar los datos cuando cambien
  useEffect(() => {
    console.log('🔍 [useBlogFilters] useEffect - Datos cambiaron:', Datos?.length);
    setFilteredData(Datos);
  }, [Datos]);

  const applyFilters = useCallback((search = searchTerm, categoryIds = activeCategories, authorIds = activeAuthors) => {
    console.log('🔍 [useBlogFilters] applyFilters ejecutado con:');
    console.log('  - search:', search);
    console.log('  - categoryIds:', categoryIds);
    console.log('  - authorIds:', authorIds);
    console.log('  - Datos originales length:', Datos?.length);
    
    let filtered = [...Datos];
    console.log('  - filtered inicial length:', filtered?.length);

    if (search) {
      console.log('  - Aplicando filtro de búsqueda:', search);
      filtered = filtered.filter(blog => 
        blog.tema.toLowerCase().includes(search.toLowerCase()) ||
        blog.contenido.toLowerCase().includes(search.toLowerCase()) ||
        blog.psicologo?.toLowerCase().includes(search.toLowerCase())
      );
      console.log('  - filtered después de búsqueda length:', filtered?.length);
    }

    if (categoryIds.length > 0) {
      console.log('  - Aplicando filtro de categorías:', categoryIds);
      const categoryNames = categoryIds.map(id => 
        Categories.find(cat => cat.idCategoria === id)?.nombre
      ).filter(Boolean);
      console.log('  - categoryNames encontrados:', categoryNames);
      
      filtered = filtered.filter(blog => 
        categoryNames.some(categoryName => blog.categoria === categoryName)
      );
      console.log('  - filtered después de categorías length:', filtered?.length);
    }

    if (authorIds.length > 0) {
      console.log('  - Aplicando filtro de autores:', authorIds);
      const authorNames = authorIds.map(id => 
        Authors.find(a => a.id === id)?.name
      ).filter(Boolean);
      console.log('  - authorNames encontrados:', authorNames);
      
      filtered = filtered.filter(blog => 
        authorNames.some(authorName => blog.psicologo?.includes(authorName || ''))
      );
      console.log('  - filtered después de autores length:', filtered?.length);
    }

    console.log('🔍 [useBlogFilters] Resultado final filteredData length:', filtered?.length);
    setFilteredData(filtered);
  }, [Datos, Categories, Authors, searchTerm, activeCategories, activeAuthors]);

  const handleCategoryFilter = useCallback((categoryId: number) => {
    const newCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter(id => id !== categoryId)
      : [...activeCategories, categoryId];
    
    setActiveCategories(newCategories);
    applyFilters(searchTerm, newCategories, activeAuthors);
  }, [activeCategories, searchTerm, activeAuthors, applyFilters]);

  const handleAuthorFilter = useCallback((authorId: number) => {
    const newAuthors = activeAuthors.includes(authorId)
      ? activeAuthors.filter(id => id !== authorId)
      : [...activeAuthors, authorId];
    
    setActiveAuthors(newAuthors);
    applyFilters(searchTerm, activeCategories, newAuthors);
  }, [activeAuthors, searchTerm, activeCategories, applyFilters]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    applyFilters(value, activeCategories, activeAuthors);
  }, [activeCategories, activeAuthors, applyFilters]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setActiveCategories([]);
    setActiveAuthors([]);
    setFilteredData(Datos);
  }, [Datos]);

  return {
    filteredData,
    activeCategories,
    activeAuthors,
    searchTerm,
    handleCategoryFilter,
    handleAuthorFilter,
    handleSearch,
    clearAllFilters
  };
}; 