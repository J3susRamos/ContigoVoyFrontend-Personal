"use client";
import {
  BlogsWebSite,
  GetBlogsPreviewApi,
  GetCagetories,
} from "@/app/apiRoutes";
import BlogPageComponentOptimized from "@/components/blog/BlogPageComponentOptimized";
import BlogPageLoading from "@/components/blog/BlogPageLoading";
import {
  ApiResponse,
  AuthorsApi,
  CategoriaApi,
} from "@/interface";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [categoria, setCategoria] = useState<CategoriaApi | null>(null);
  const [authors, setAuthors] = useState<AuthorsApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dato, category, author] = await Promise.all([
          BlogsWebSite(),
          GetCagetories(),
          GetBlogsPreviewApi()
        ]);
        
        setData(dato);
        setCategoria(category);
        setAuthors(author);
      } catch (error) {
        setError("Error obteniendo blogs");
        console.error(error);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div>
      {error && (
        <p className="flex items-center justify-center h-screen">{error}</p>
      )}
      {(data && categoria && authors) ? (
        <BlogPageComponentOptimized
          Datos={data.result}
          Categories={categoria.result}
          Authors={authors.result}
        />
      ) : (
        <BlogPageLoading />
      )}
    </div>
  );
}
