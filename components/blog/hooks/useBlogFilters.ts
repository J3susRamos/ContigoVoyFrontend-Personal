import { useState, useCallback } from "react";
import { BlogPreviewData, Categoria, Authors } from "@/interface";

export const useBlogFilters = (Datos: BlogPreviewData[], Categories: Categoria[], Authors: Authors[]) => {
  const [filteredData, setFilteredData] = useState<BlogPreviewData[]>(Datos);
  const [activeCategories, setActiveCategories] = useState<number[]>([]);
  const [activeAuthors, setActiveAuthors] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const applyFilters = useCallback((search = searchTerm, categoryIds = activeCategories, authorIds = activeAuthors) => {
    let filtered = [...Datos];

    if (search) {
      filtered = filtered.filter(blog => 
        blog.tema.toLowerCase().includes(search.toLowerCase()) ||
        blog.contenido.toLowerCase().includes(search.toLowerCase()) ||
        blog.psicologo?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryIds.length > 0) {
      const categoryNames = categoryIds.map(id => 
        Categories.find(cat => cat.idCategoria === id)?.nombre
      ).filter(Boolean);
      
      filtered = filtered.filter(blog => 
        categoryNames.some(categoryName => blog.categoria === categoryName)
      );
    }

    if (authorIds.length > 0) {
      const authorNames = authorIds.map(id => 
        Authors.find(a => a.id === id)?.name
      ).filter(Boolean);
      
      filtered = filtered.filter(blog => 
        authorNames.some(authorName => blog.psicologo?.includes(authorName || ''))
      );
    }

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