"use client";
import {
  BlogsWebSite,
  GetBlogsPreviewApi,
  GetCagetories,
} from "@/app/apiRoutes";
import BlogPageComponent from "@/components/blog/BlogPageComponent";
import BlogPageLoading from "@/components/blog/BlogPageLoading";
import {
  ApiResponse,
  AuthorsApi,
  CategoriaApi,
} from "@/interface";
import { useEffect, useState } from "react";

export default  function BlogPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [categoria, setCategoria] = useState<CategoriaApi | null>(null);
  const [authors, setAuthors] = useState<AuthorsApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Blog | Centro Psicológico Contigo Voy";

    const metaDescription = document.querySelector("meta[name='description']");

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",

        " En el Blog de Contigo Voy encontrarás inspiración para transformar tu vida. Desde como sanar emocionalmente hasta artículos que te harán vivir con conciencia."
      );
    } else {
      const meta = document.createElement("meta");

      meta.name = "description";

      meta.content =
        " En el Blog de Contigo Voy encontrarás inspiración para transformar tu vida. Desde como sanar emocionalmente hasta artículos que te harán vivir con conciencia.";

      document.head.appendChild(meta);
    }
    async function fetchData() {
      try {
        const dato = await BlogsWebSite();
        const category = await GetCagetories();
        const author = await GetBlogsPreviewApi();
        setData(dato);
        setCategoria(category);
        setAuthors(author);
      } catch (error) {
        setError("Error obteniendo blogs");
        console.error(error);
      }
    }
    fetchData().catch(error => {
      console.error("Error in fetchData:", error);
    });
  }, []);

  return (
    <div>
      {error && (
        <p className="flex items-center justify-center h-screen">{error}</p>
      )}
      { (data && categoria && authors) ?
        <BlogPageComponent
          Datos={data.result}
          Categories={categoria.result}
          Authors={authors.result}
        /> : <BlogPageLoading/>
      }
    </div>
  );
}
