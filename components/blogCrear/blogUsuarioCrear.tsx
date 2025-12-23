"use client";

import { Autocomplete, AutocompleteItem, Button, Input, Textarea, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Listarblog } from "./listarblog";
import Tiptap from "./textEdit";
import { BlogApi, Categoria, UsuarioLocalStorage } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "../ToastStyle";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Plus, X, Settings2 } from "lucide-react";
import Image from "next/image";

// === Helpers para obtener categorías y blog por id ===
export const CategoriaGet = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/categorias`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const BlogById = async (id: number) => {
  try {
    const response = await fetch(
      //`${process.env.NEXT_PUBLIC_API_URL}api/blogs/${id}`,
      `${process.env.NEXT_PUBLIC_API_URL}api/blogs/id/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
};

export default function BlogUsuarioCrear() {
  // vistas: crear | listar | editar
  const [view, setView] = useState<"crear" | "listar" | "editar">("crear");

  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [tema, setTema] = useState("");
  const [urls, setUrls] = useState<string[]>([]); // Array de URL
  const [contenido, setContenido] = useState("");
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [value, setValue] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [originalIdPsicologo, setOriginalIdPsicologo] = useState<number | null>(
    null,
  );
  const [base64Images, setBase64Images] = useState<string[]>([]); // Array de imágenes base64
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SEO
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");

  // Estado para metadata de imágenes
  const [imageMeta, setImageMeta] = useState<Record<string, { alt: string; title: string }>>({});

  // Función para actualizar metadata
  const updateImageMeta = (type: 'base64' | 'url', index: number, field: 'alt' | 'title', value: string) => {
    setImageMeta(prev => ({
      ...prev,
      [`${type}-${index}`]: {
        ...prev[`${type}-${index}`] || { alt: "", title: "" },
        [field]: value
      }
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategoria = async () => {
      try {
        const data = await CategoriaGet();
        if (isMounted) {
          setCategoria(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch categories:", error);
        }
      }
    };

    fetchCategoria().catch((error) => {
      console.error("Error fetching categories:", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchUser = () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };
    fetchUser();
  }, []);

  // ========= SUBIR IMÁGENES =========
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const currentImageCount =
        base64Images.length + urls.filter((url) => url.trim() !== "").length;
      const currentFullLinksCount = base64Images.length + urls.length;
      const newImageCount = currentImageCount + files.length;

      if (newImageCount > 6) {
        showToast(
          "error",
          `No puede agregar más de 6 imágenes. Actualmente tiene ${currentImageCount} imágenes.`,
        );
        return;
      }

      const newBase64Images: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        //Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          showToast(
            "error",
            `La imagen ${file.name} es demasiado grande. Máximo 5MB.`,
          );
          continue;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          showToast("error", `${file.name} no es un archivo de imagen válido.`);
          continue;
        }

        try {
          showToast("info", `Procesando imagen ${i + 1}/${files.length}...`);
          const webpImage = await convertImageToWebP(file);
          const base64 = await convertToBase64(webpImage);

          if (base64.length > 400000) {
            showToast(
              "error",
              `La imagen ${file.name} procesada sigue siendo muy grande. Intenta con una imagen más pequeña.`,
            );
            continue;
          }

          newBase64Images.push(base64);
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          showToast(
            "error",
            `Error al procesar ${file.name}. Intenta nuevamente.`,
          );
        }
      }

      if (newBase64Images.length > 0) {
        setBase64Images((prev) => [...prev, ...newBase64Images]);
        let deleteCount = 0;
        const totalImagesToDelete = Math.max(
          currentFullLinksCount + newBase64Images.length - 6,
          0,
        );
        const deletedUnusedUrls = urls.filter((item) => {
          if (item.trim() == "" && deleteCount < totalImagesToDelete) {
            deleteCount++;
            return false;
          }
          return true;
        });
        setUrls(deletedUnusedUrls);
        showToast(
          "success",
          `${newBase64Images.length} imagen(es) cargada(s) correctamente.`,
        );
      }
    },
    [base64Images, urls],
  );

  const removeImage = (index: number, type: "base64" | "url") => {
    if (type === "base64") {
      setBase64Images((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUrls((prev) => prev.filter((_, i) => i !== index));
    }
    // Limpiar el meta
    const newMeta = { ...imageMeta };
    delete newMeta[`${type}-${index}`];
    setImageMeta(newMeta);
  };

  const addUrlImage = () => {
    const currentImageCount = base64Images.length + urls.length;

    if (currentImageCount >= 6) {
      showToast("error", "No puede agregar más de 6 imágenes.");
      return;
    }

    setUrls((prev) => [...prev, ""]);
  };

  const updateUrlImage = (index: number, value: string) => {
    setUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  // ========= CREAR CATEGORÍA =========
  const postNewCategoria = async () => {
    const cookies = parseCookies();
    const token = cookies["session"];

    if (!token) {
      console.error("No authentication token found");
      showToast("error", "Error al crear la categoría");
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/categorias`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre: value }),
        },
      );

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        showToast("error", "Error al crear la categoría");
        return null;
      }

      const info = await response.json();
      setSelectedKey(info.result.idCategoria);
      return info.result.idCategoria;
    } catch (error) {
      console.error("Error creating category:", error);
      showToast("error", "Error al crear la categoría");
      return null;
    }
  };

  // ========= VALIDACIÓN BÁSICA =========
  const validateForm = (): boolean => {
    const sanitizedTema = tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

    if (!sanitizedTema) {
      showToast("error", "El título es requerido.");
      return false;
    }

    if (sanitizedTema.length < 20) {
      showToast("error", "El título debe tener al menos 20 caracteres.");
      return false;
    }

    if (sanitizedTema.includes('<svg') || sanitizedTema.includes('<?xml') || sanitizedTema.includes('viewBox')) {
      showToast("error", "El título contiene código SVG o XML. Por favor usa un título simple.");
      return false;
    }

    if (sanitizedTema.length > 200) {
      showToast("error", "El título es demasiado largo. Máximo 200 caracteres.");
      return false;
    }

    if (!contenido.trim()) {
      showToast("error", "El contenido es requerido.");
      return false;
    }

    const getTextContent = (html: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    };

    const textContent = getTextContent(contenido).trim();
    if (textContent.length < 10) {
      showToast("error", "El contenido debe tener al menos 10 caracteres.");
      return false;
    }

    if (!selectedKey && !value.trim()) {
      showToast("error", "La categoría es requerida.");
      return false;
    }

    const validUrls = urls.filter(
      (url) => url.trim() !== "" && url.startsWith("http"),
    );
    const totalImages = base64Images.length + validUrls.length;
    if (totalImages === 0) {
      showToast("error", "Se requiere al menos una imagen.");
      return false;
    }

    return true;
  };

  const getUserId = () => {
    if (!user) return null;
    return user.idpsicologo || user.id;
  };

  // ========= RESET FORM =========
  const resetForm = useCallback(() => {
    setTema("");
    setContenido("");
    setSelectedKey(null);
    setValue("");
    setBase64Images([]);
    setUrls([]);
    setEditingBlogId(null);
    setOriginalIdPsicologo(null);
    setMetaTitle("");
    setKeywords("");
    setMetaDescription("");
    setImageMeta({}); // Resetear metadata
  }, []);

  // ========= SUBMIT (CREAR / EDITAR) =========
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEditing = view === "editar" && editingBlogId !== null;

    try {
      setIsSubmitting(true);

      const userId = getUserId();
      if (!userId || !user?.id) {
        showToast(
          "error",
          "Usuario no identificado. Por favor inicia sesión nuevamente.",
        );
        return;
      }

      const sanitizedTemaCheck = tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!sanitizedTemaCheck || sanitizedTemaCheck.length < 5) {
        showToast("error", "El título debe tener al menos 5 caracteres.");
        return;
      }

      if (sanitizedTemaCheck.length > 200) {
        showToast("error", "El título no puede exceder 200 caracteres.");
        return;
      }

      const validUrls = urls.filter(
        (url) => url.trim() !== "" && url.startsWith("http"),
      );
      const totalImages = base64Images.length + validUrls.length;
      if (totalImages < 1) {
        showToast(
          "error",
          "Debe agregar al menos 1 imagen para crear el blog.",
        );
        return;
      }

      if (totalImages > 6) {
        showToast("error", "No puede agregar más de 6 imágenes.");
        return;
      }

      for (let i = 0; i < base64Images.length; i++) {
        if (base64Images[i].length > 500000) {
          showToast(
            "error",
            `La imagen ${i + 1} es demasiado grande. Máx. 500KB.`,
          );
          return;
        }

        if (!base64Images[i].startsWith("data:image/")) {
          showToast(
            "error",
            `Formato de imagen ${i + 1} inválido.`,
          );
          return;
        }
      }

      for (let i = 0; i < validUrls.length; i++) {
        if (!validUrls[i].startsWith("http")) {
          showToast(
            "error",
            `La URL de la imagen ${i + 1} debe comenzar con http:// o https://`,
          );
          return;
        }
      }

      let categoriaId: number | null;
      if (selectedKey !== null) {
        categoriaId = parseInt(selectedKey);
      } else {
        categoriaId = await postNewCategoria();
      }

      if (!categoriaId) {
        showToast(
          "error",
          "Error al procesar la categoría. Intenta nuevamente.",
        );
        return;
      }

      const finalIdPsicologo = user.idpsicologo || user.id;

      const cleanContentForBackend = (htmlContent: string): string => {
        try {
          let cleaned = htmlContent
            .replace(/\s+data-position-x="[^"]*"/g, '')
            .replace(/\s+data-position-y="[^"]*"/g, '')
            .replace(/\s+data-mode="[^"]*"/g, '')
            .replace(/\s+data-align="[^"]*"/g, '')
            .replace(/\s+data-float="[^"]*"/g, '')
            .replace(/\s+positionx="[^"]*"/gi, '')
            .replace(/\s+positiony="[^"]*"/gi, '')
            .replace(/\s+style="[^"]*transform:[^"]*translate[^"]*"/g, '')
            .replace(/\s+style="[^"]*z-index:[^"]*"/g, '')
            .replace(/\s+style="[^"]*will-change:[^"]*"/g, '')
            .replace(/\s+style="[^"]*backface-visibility:[^"]*"/g, '');

          cleaned = cleaned.replace(/\s+style=""\s*/g, ' ');
          cleaned = cleaned.replace(/\s+style="\s*"\s*/g, ' ');

          return cleaned;
        } catch (error) {
          console.error("Error cleaning content:", error);
          return htmlContent;
        }
      };

      const compressImagesInContent = (htmlContent: string): Promise<string> => {
        return new Promise((resolve) => {
          const base64ImageRegex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g;
          let compressedContent = htmlContent;
          const matches = Array.from(htmlContent.matchAll(base64ImageRegex));

          if (matches.length === 0) {
            resolve(htmlContent);
            return;
          }

          let processedCount = 0;

          matches.forEach((match) => {
            const [fullMatch] = match;

            try {
              const img = document.createElement('img') as HTMLImageElement;
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              img.onload = () => {
                const maxSize = 400;
                let { width, height } = img;

                if (width > maxSize || height > maxSize) {
                  if (width > height) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                  } else {
                    width = (width * maxSize) / height;
                    height = maxSize;
                  }
                }

                canvas.width = width;
                canvas.height = height;

                ctx?.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);

                compressedContent = compressedContent.replace(fullMatch, compressedBase64);

                processedCount++;
                if (processedCount === matches.length) {
                  resolve(compressedContent);
                }
              };

              img.onerror = () => {
                processedCount++;
                if (processedCount === matches.length) {
                  resolve(compressedContent);
                }
              };

              img.src = fullMatch;
            } catch (error) {
              console.error('Error compressing image:', error);
              processedCount++;
              if (processedCount === matches.length) {
                resolve(compressedContent);
              }
            }
          });
        });
      };

      const cleanedContenido = cleanContentForBackend(contenido);
      showToast("info", "Optimizando imágenes...");

      const imagesToSend = [...base64Images, ...validUrls];
      const compressedContenido = await compressImagesInContent(cleanedContenido);
      const finalContenido = compressedContenido;

      if (!finalContenido || finalContenido.trim().length === 0) {
        console.error("Content processing resulted in empty content");
        showToast("error", "Error al procesar el contenido. Intenta nuevamente.");
        return;
      }

      const sanitizedContenido = finalContenido
        .replace(/'/g, "''")
        .replace(/\\/g, "\\\\");

      if (!sanitizedContenido || sanitizedContenido.trim().length === 0) {
        console.error("Content sanitization resulted in empty content");
        showToast("error", "Error al procesar el contenido. Intenta nuevamente.");
        return;
      }

      const maxContentSize = 1500000;

      const base64ImageMatches = sanitizedContenido.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g) || [];
      const imageContentSize = base64ImageMatches.join('').length;

      if (sanitizedContenido.length > maxContentSize) {
        if (imageContentSize > 0) {
          showToast("error", "El contenido con imágenes es muy pesado. Usa imágenes más pequeñas o menos imágenes en el contenido.");
        } else {
          showToast("error", "El contenido es demasiado largo.");
        }
        return;
      }

      if (sanitizedContenido.includes('<svg') || sanitizedContenido.includes('<?xml')) {
        console.error("SVG or XML content detected in blog content");
        showToast("error", "El contenido contiene código SVG o XML que no es válido.");
        return;
      }

      // Construir imagenesMeta dinámicamente
      const imagenesMetaData = [
        ...base64Images.map((img, i) => ({
          url: img,
          altText: imageMeta[`base64-${i}`]?.alt || "",
          title: imageMeta[`base64-${i}`]?.title || "",
        })),
        ...validUrls.map((url, i) => ({
          url: url,
          altText: imageMeta[`url-${i}`]?.alt || "",
          title: imageMeta[`url-${i}`]?.title || "",
        }))
      ];

      const dataToSend: BlogApi = {
        idCategoria: categoriaId,
        tema: sanitizedTemaCheck,
        contenido: sanitizedContenido,
        imagenes: imagesToSend,
        idPsicologo: finalIdPsicologo,
        metaTitle: metaTitle.trim(),
        keywords: keywords.trim(),
        metaDescription: metaDescription.trim(),
        imagenesMeta: imagenesMetaData, // envía los datos
      };

      if (!dataToSend.idPsicologo) {
        showToast("error", "Error: ID de psicólogo no válido.");
        return;
      }

      const cookies = parseCookies();
      const token = cookies["session"];

      if (!token) {
        showToast(
          "error",
          "Sesión expirada. Por favor inicia sesión nuevamente.",
        );
        return;
      }

      const apiUrl = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${editingBlogId}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/blogs`;

      const method = isEditing ? "PUT" : "POST";

      showToast("info", "Enviando datos...");

      let response: Response;
      try {
        response = await fetch(apiUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        });
      } catch (fetchError) {
        console.error("Network error during fetch:", fetchError);
        showToast("error", "Error de conexión. Verifica tu conexión a internet.");
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        showToast("error", "Error al procesar la respuesta del servidor");
        return;
      }

      if (response.ok) {
        showToast(
          "success",
          isEditing
            ? "Blog actualizado correctamente"
            : "Blog creado correctamente",
        );

        // Limpio y me voy a "Ver Blogs"
        resetForm();
        setView("listar");
      } else {
        let errorMessage = "Error desconocido";

        if (data?.status_message) {
          errorMessage = data.status_message;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.description) {
          errorMessage = data.description;
        }

        if (response.status === 413) {
          errorMessage =
            "El archivo es demasiado grande. Reduce el tamaño de la imagen.";
        } else if (response.status === 422) {
          errorMessage =
            "Datos inválidos. Verifica que todos los campos estén correctos.";
        } else if (response.status === 500) {
          errorMessage =
            "Error interno del servidor. Intenta con una imagen más pequeña o verifica el contenido.";
        }

        if (data.message) {
          showToast("error", data.message);
        } else {
          showToast("error", errorMessage);
        }
      }
    } catch (error) {
      console.log("Submission error:", error);
      let errorMessage = "Error inesperado. Por favor intenta nuevamente.";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Error de conexión con el servidor. Verifica tu conexión a internet.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========= EDITAR: CARGAR DATOS AL FORM =========
  const handleEdit = async (id: number) => {
    const blog = await BlogById(id);
    if (blog) {
      const currentPsicologoId = user?.idpsicologo || user?.id;

      if (blog.idPsicologo !== currentPsicologoId) {
        showToast(
          "error",
          "No tienes permisos para editar este blog. Solo puedes editar tus propios blogs.",
        );
        return;
      }

      setTema(blog.tema);

      // Cargar imágenes y su metadata
      const newBase64: string[] = [];
      const newUrls: string[] = [];
      const newMeta: Record<string, { alt: string; title: string }> = {};

      if (blog.imagenesMeta && Array.isArray(blog.imagenesMeta)) {
        blog.imagenesMeta.forEach((img: any) => {
          const src = img.url || img.src || "";
          if (src.startsWith("data:image/")) {
            const idx = newBase64.length;
            newBase64.push(src);
            newMeta[`base64-${idx}`] = { alt: img.altText || "", title: img.title || "" };
          } else if (src.startsWith("http")) {
            const idx = newUrls.length;
            newUrls.push(src);
            newMeta[`url-${idx}`] = { alt: img.altText || "", title: img.title || "" };
          }
        });
      } else if (blog.imagenes) {
         // Fallback por si no hay imagenesMeta
         blog.imagenes.forEach((src: string) => {
            if (src.startsWith("data:image/")) newBase64.push(src);
            else newUrls.push(src);
         });
      }

      setBase64Images(newBase64);
      setUrls(newUrls);
      setImageMeta(newMeta); // llena los inputs de Alt y Title

      setContenido(blog.contenido);
      setSelectedKey(blog.idCategoria.toString());
      setEditingBlogId(blog.idBlog);      // ⭐ IMPORTANTE: usar idBlog, no id
      setOriginalIdPsicologo(blog.idPsicologo);

      // si ya estás guardando meta en el back y lo devuelves, aquí los podrías setear
      setMetaTitle(blog.metaTitle || "");
      setKeywords(blog.keywords || "");
      setMetaDescription(blog.metaDescription || "");

      // cambio de vista a modo edición
      setView("editar");
    }
  };

  // ========= RENDER =========
  const isEditing = view === "editar" && editingBlogId !== null;

  return (
    <div className="dark:bg-[#020202] min-h-screen">
      {/* Barra superior con tabs */}
      <div className="w-full h-16 bg-[#4d0b73] items-center justify-start flex">
        <div className="ml-10 flex justify-between items-center w-full max-w-[230px] gap-x-3">
          {/* Boton Crear Blog */}
          <Button
            radius="full"
            className={
              view === "crear" || view === "editar"
                ? "bg-white text-[16px] leading-[20px] text-[#6364F4] font-bold shadow rounded-[5px]"
                : "bg-[rgba(186,76,216,0.59)] text-[#ecd5ee] text-[16px] leading-[20px] rounded-[5px]"
            }
            onPress={() => {
              setView("crear");
              resetForm();
            }}
          >
            Crear Blog
          </Button>

          {/* Boton Ver Blogs */}
          <Button
            onPress={() => setView("listar")}
            className={
              view === "listar"
                ? "bg-white text-[16px] leading-[20px] text-[#6364F4] font-bold shadow rounded-[5px]"
                : "bg-[rgba(186,76,216,0.59)] text-[#ecd5ee] text-[16px] leading-[20px] rounded-[5px]"
            }
          >
            Ver Blogs
          </Button>
        </div>
      </div>

      {/* LISTAR BLOGS */}
      {view === "listar" ? (
        <div className="mx-10 mt-14 dark:text-white">
          <Listarblog onEdit={handleEdit} />
        </div>
      ) : (
        // FORMULARIO (se usa para crear y editar)
        <div className="flex flex-col md:flex-row gap-10 mx-auto px-10 mt-8 mb-8 max-w-scv18 h-full">
          <div className="flex-1 flex flex-col justify-between gap-y-scv8 items-center w-full mx-auto bg-slate-200 dark:bg-[#121212] border border-[#f0f0f0] dark:border dark:border-white/20 rounded-lg p-scv4">
            {/* Metadatos SEO */}
            <div className="w-full">
              <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
                Metadatos SEO
              </h1>

              {/* Título Meta */}
              <div className="mb-scv4">
                <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                  Título Meta <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Título para SEO"
                  classNames={{
                    input: "dark:!text-gray-100",
                    inputWrapper:
                      "!bg-white dark:!bg-[#19191a] border-2 border-[#634AE2] rounded-lg",
                  }}
                  radius="lg"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
              </div>

              {/* Keywords */}
              <div className="mb-scv4">
                <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                  Keywords (separadas por comas) <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="ejemplo: react, tailwind, seo"
                  classNames={{
                    input: "dark:!text-gray-100",
                    inputWrapper:
                      "!bg-white dark:!bg-[#19191a] border-2 border-[#634AE2] rounded-lg",
                  }}
                  radius="lg"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              {/* Descripción Meta */}
              <div className="mb-scv4">
                <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                  Descripción Meta
                </label>
                <Textarea
                  placeholder="Breve descripción para SEO (opcional)"
                  classNames={{
                    input: "dark:!text-gray-100",
                    inputWrapper:
                      "!bg-white dark:!bg-[#19191a] border-2 border-[#634AE2] rounded-lg",
                  }}
                  radius="lg"
                  minRows={2}
                  maxRows={4}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Titulo */}
            <div className="w-full">
              <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
                Título
              </h1>
              <Textarea
                aria-label="Titulo"
                placeholder="Ingresar Titulo (los saltos de línea se convertirán a espacios al guardar)"
                classNames={{
                  input: "dark:!text-gray-100 whitespace-pre-wrap",
                  inputWrapper:
                    "!bg-white dark:!bg-[#19191a] border-2 border-[#634AE2] rounded-lg",
                }}
                radius="lg"
                minRows={2}
                maxRows={4}
                value={tema}
                onChange={(e) => setTema(e.target.value)}
              />
              {tema && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg border">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Preview del título como se guardará:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 break-words hyphens-auto max-w-full overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()}
                  </p>
                </div>
              )}
            </div>

            {/* Categoria */}
            <div className="w-full">
              <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
                Categoría
              </h1>
              <div className="flex w-full flex-col">
                <Autocomplete
                  className="dark:[&_[data-slot=input-wrapper]]:bg-[#19191a] [&_[data-slot=input-wrapper]]:bg-white [&_[data-slot=input-wrapper]]:border-[#634AE2] [&_[data-slot=input-wrapper]]:rounded-lg"
                  radius="full"
                  inputProps={{
                    className: "dark:!text-gray-100 ",
                  }}
                  allowsCustomValue={true}
                  placeholder="Ingresar Categoria"
                  defaultItems={categoria}
                  aria-label="Categoria"
                  variant="faded"
                  selectedKey={selectedKey}
                  onInputChange={(value) => setValue(value)}
                  onSelectionChange={(value) =>
                    setSelectedKey(value?.toString() || null)
                  }
                >
                  {(categoria) => (
                    <AutocompleteItem key={categoria.idCategoria}>
                      {categoria.nombre}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Imagen */}
            <div className="w-full">
              <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
                Imágenes (Mínimo 1, Máximo 6)
              </h1>

              <div className="w-full flex flex-col gap-2">
                {/* Subir imágenes */}
                <div className="relative border-2 border-[#634AE2] bg-white dark:bg-[#19191a] rounded-lg h-32 w-full flex justify-center items-center cursor-pointer overflow-hidden">
                  <div className="flex flex-col items-center">
                    <Plus
                      width={40}
                      height={40}
                      strokeWidth={2}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <span className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Subir imágenes (máximo{" "}
                      {6 -
                        base64Images.length -
                        urls.filter((url) => url.trim() !== "").length}
                      )
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={
                      base64Images.length +
                      urls.filter((url) => url.trim() !== "").length >=
                      6
                    }
                  />
                </div>

                {/* base64 */}
                {base64Images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {base64Images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          width={150}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index, "base64")}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>

                        <Popover placement="top">
                          <PopoverTrigger>
                            <Button size="sm" isIconOnly className="absolute bottom-1 right-1 bg-black/60 text-white min-w-0 w-8 h-8 rounded-full"><Settings2 size={16}/></Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="p-3 flex flex-col gap-2 w-48 bg-white dark:bg-[#19191a]">
                              <p className="text-xs font-bold">Metadata Imagen {index + 1}</p>
                              <Input label="Alt" size="sm" variant="bordered" value={imageMeta[`base64-${index}`]?.alt || ""} onChange={(e) => updateImageMeta('base64', index, 'alt', e.target.value)} />
                              <Input label="Title" size="sm" variant="bordered" value={imageMeta[`base64-${index}`]?.title || ""} onChange={(e) => updateImageMeta('base64', index, 'title', e.target.value)} />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar URL */}
                {base64Images.length + urls.length < 6 && (
                  <Button
                    onPress={addUrlImage}
                    className="bg-[#634AE2] text-white"
                    size="sm"
                  >
                    Agregar imagen por URL
                  </Button>
                )}

                {/* Inputs URL con Popover para Metadata */}
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <button
                      onClick={() => removeImage(index, "url")}
                      className="bg-red-500 text-white rounded-full w-8 h-8 shrink-0 flex items-center justify-center"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                    <div className="flex-1 flex gap-1 items-center">
                      <Input
                        placeholder={`URL de imagen ${index + 1}`}
                        classNames={{
                          input: "dark:!text-gray-100 ",
                          inputWrapper: "!bg-white dark:!bg-[#19191a] border-2 border-[#634AE2] rounded-lg",
                        }}
                        radius="full"
                        height={43}
                        value={url}
                        onChange={(e) => updateUrlImage(index, e.target.value)}
                      />
                      <Popover placement="left">
                        <PopoverTrigger>
                          <Button size="sm" isIconOnly className="bg-[#634AE2] text-white rounded-full min-w-0 w-10 h-10"><Settings2 size={18}/></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-3 flex flex-col gap-2 w-48 bg-white dark:bg-[#19191a]">
                            <p className="text-xs font-bold">Metadata URL {index + 1}</p>
                            <Input label="Alt" size="sm" variant="bordered" value={imageMeta[`url-${index}`]?.alt || ""} onChange={(e) => updateImageMeta('url', index, 'alt', e.target.value)} />
                            <Input label="Title" size="sm" variant="bordered" value={imageMeta[`url-${index}`]?.title || ""} onChange={(e) => updateImageMeta('url', index, 'title', e.target.value)} />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}

                {/* Preview URLs */}
                {urls.filter(
                  (url) => url.trim() !== "" && url.startsWith("http"),
                ).length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {urls
                        .filter(
                          (url) => url.trim() !== "" && url.startsWith("http"),
                        )
                        .map((url, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={url}
                              alt={`URL Imagen ${index + 1}`}
                              width={150}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg"
                              onError={() =>
                                showToast(
                                  "error",
                                  `Error cargando imagen ${index + 1} desde URL`,
                                )
                              }
                            />
                          </div>
                        ))}
                    </div>
                  )}

                {/* Contador */}
                <div className="w-full">
                  <span
                    className={`text-sm font-medium ${base64Images.length +
                      urls.filter((url) => url.trim() !== "").length >=
                      1
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-800 dark:text-red-400"
                      }`}
                  >
                    Imágenes agregadas:{" "}
                    {base64Images.length +
                      urls.filter((url) => url.trim() !== "").length}
                    /6
                  </span>
                </div>
              </div>
            </div>

            {/* Botón submit */}
            <div className="w-full flex justify-center">
              <Button
                onPress={handleSubmit}
                radius="full"
                className="px-scv6 hover:bg-white text-[16px] leading-[20px] hover:text-[#6364F4] font-bold shadow rounded-[5px]
                  bg-[#634AE2] text-[#ecd5ee]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Procesando..."
                  : isEditing
                    ? "Guardar"
                    : "Enviar"}
              </Button>
            </div>
          </div>

          {/* Editor de descripción */}
          <div className="flex-[2] flex flex-col w-full max-w-full bg-slate-200 dark:bg-[#19191a] border border-[#f0f0f0] dark:border dark:border-white/20 rounded-lg p-scv4">
            <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
              Descripción
            </h1>
            <div className="w-full flex flex-col grow">
              <Tiptap setContenido={setContenido} contenido={contenido} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
