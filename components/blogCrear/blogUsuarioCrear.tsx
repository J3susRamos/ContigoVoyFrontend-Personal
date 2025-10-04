"use client";

import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Listarblog } from "./listarblog";
import Tiptap from "./textEdit";
import { BlogApi, Categoria, UsuarioLocalStorage } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "../ToastStyle";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Plus, X } from "lucide-react";
import Image from "next/image";

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
      `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${id}`,
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
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [tema, setTema] = useState("");
  const [urls, setUrls] = useState<string[]>([]); // Array de URL
  const [view, setView] = useState("crear");
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

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Verificar que no exceda el límite de 6 imágenes
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
          // Convertir la imagen a WebP con compresión
          const webpImage = await convertImageToWebP(file);

          // Convertir la imagen WebP a Base64
          const base64 = await convertToBase64(webpImage);

          // Check the final base64 size
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

  const validateForm = (): boolean => {
    // Sanitize title for validation (convert line breaks to spaces)
    const sanitizedTema = tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Validate title - server requires at least 20 characters
    if (!sanitizedTema) {
      showToast("error", "El título es requerido.");
      return false;
    }

    if (sanitizedTema.length < 20) {
      showToast("error", "El título debe tener al menos 20 caracteres.");
      return false;
    }

    // Check for SVG/XML content in tema
    if (sanitizedTema.includes('<svg') || sanitizedTema.includes('<?xml') || sanitizedTema.includes('viewBox')) {
      showToast("error", "El título contiene código SVG o XML. Por favor usa un título simple.");
      return false;
    }

    // Validate title length
    if (sanitizedTema.length > 200) {
      showToast("error", "El título es demasiado largo. Máximo 200 caracteres.");
      return false;
    }

    // Validate content - server requires at least 10 characters
    if (!contenido.trim()) {
      showToast("error", "El contenido es requerido.");
      return false;
    }

    // Get actual text content without HTML tags
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

    // Validate category
    if (!selectedKey && !value.trim()) {
      showToast("error", "La categoría es requerida.");
      return false;
    }

    // Validate image - check if we have at least one image
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true); // Add loading state

      const userId = getUserId();
      if (!userId) {
        showToast(
          "error",
          "Usuario no identificado. Por favor inicia sesión nuevamente.",
        );
        return;
      }

      // Validate required fields
      if (!user?.id) {
        showToast(
          "error",
          "Usuario no identificado. Por favor inicia sesión nuevamente.",
        );
        return;
      }

      // Validate tema length (sanitize first)
      const sanitizedTemaCheck = tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!sanitizedTemaCheck || sanitizedTemaCheck.length < 5) {
        showToast("error", "El título debe tener al menos 5 caracteres.");
        return;
      }

      if (sanitizedTemaCheck.length > 200) {
        showToast("error", "El título no puede exceder 200 caracteres.");
        return;
      }

      // Validate images - minimum 1, maximum 6
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

      // Validate base64 images size
      for (let i = 0; i < base64Images.length; i++) {
        if (base64Images[i].length > 500000) {
          showToast(
            "error",
            `La imagen ${i + 1} es demasiado grande. Por favor selecciona una imagen más pequeña (máx. 500KB).`,
          );
          return;
        }

        if (!base64Images[i].startsWith("data:image/")) {
          showToast(
            "error",
            `Formato de imagen ${i + 1} inválido. Por favor selecciona una imagen válida.`,
          );
          return;
        }
      }

      // Validate URL format if using URLs
      for (let i = 0; i < validUrls.length; i++) {
        if (!validUrls[i].startsWith("http")) {
          showToast(
            "error",
            `La URL de la imagen ${i + 1} debe comenzar con http:// o https://`,
          );
          return;
        }
      }

      // Debug logging (will be updated after image processing)
      console.log("Current user:", user);
      console.log("User ID:", user.id);
      console.log("User idpsicologo:", user.idpsicologo);
      console.log("Original ID Psicologo from blog:", originalIdPsicologo);
      console.log("Editing blog ID:", editingBlogId);

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

      // Use id psicologo instead of user id for blog operations
      const finalIdPsicologo = user.idpsicologo || user.id;

      console.log("Final ID Psicologo to use:", finalIdPsicologo);

      // Function to clean image attributes for backend compatibility
      const cleanContentForBackend = (htmlContent: string): string => {
        try {
          // Remove custom image attributes that are only used in the editor
          let cleaned = htmlContent
            .replace(/\s+data-position-x="[^"]*"/g, '')
            .replace(/\s+data-position-y="[^"]*"/g, '')
            .replace(/\s+data-mode="[^"]*"/g, '')
            .replace(/\s+data-align="[^"]*"/g, '')
            .replace(/\s+data-float="[^"]*"/g, '')
            .replace(/\s+positionx="[^"]*"/gi, '') // Case insensitive
            .replace(/\s+positiony="[^"]*"/gi, '') // Case insensitive
            .replace(/\s+style="[^"]*transform:[^"]*translate[^"]*"/g, '') // Remove transform styles
            .replace(/\s+style="[^"]*z-index:[^"]*"/g, '') // Remove z-index
            .replace(/\s+style="[^"]*will-change:[^"]*"/g, '') // Remove will-change
            .replace(/\s+style="[^"]*backface-visibility:[^"]*"/g, ''); // Remove backface-visibility
          
          // Clean empty style attributes
          cleaned = cleaned.replace(/\s+style=""\s*/g, ' ');
          cleaned = cleaned.replace(/\s+style="\s*"\s*/g, ' ');
          
          return cleaned;
        } catch (error) {
          console.error("Error cleaning content:", error);
          return htmlContent; // Return original if cleaning fails
        }
      };

      // Function to compress base64 images in content
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
              // Create image element for compression
              const img = document.createElement('img') as HTMLImageElement;
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              img.onload = () => {
                // Calculate new dimensions (max 400px width/height for content images)
                const maxSize = 400; // Reducido aún más para minimizar tamaño
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
                
                // Draw and compress with very low quality for content images
                ctx?.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3); // Reducido a 30% quality
                
                console.log(`Compressed content image: ${Math.round(fullMatch.length/1000)}KB -> ${Math.round(compressedBase64.length/1000)}KB`);
                
                // Replace in content
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

      // Clean the content before sanitizing
      const cleanedContenido = cleanContentForBackend(contenido);

      console.log("Original content length:", contenido.length);
      console.log("Cleaned content length:", cleanedContenido.length);
      
      // Show compression progress
      showToast("info", "Optimizando imágenes...");
      
      // Debug: Count and analyze images before compression
      const originalBase64Images = cleanedContenido.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g) || [];
      console.log(`Found ${originalBase64Images.length} base64 images in content`);
      
      if (originalBase64Images.length > 0) {
        console.log("Sample image preview:", originalBase64Images[0]?.substring(0, 100) + "...");
        console.log("Average image size:", Math.round(originalBase64Images.reduce((sum, img) => sum + img.length, 0) / originalBase64Images.length / 1000) + "KB");
      }
      
      // IMPORTANTE: Las imágenes en el contenido HTML deben quedarse como parte del contenido
      // NO las extraemos como imágenes separadas del carrusel
      // Solo comprimimos las imágenes dentro del contenido si es necesario
      
      // Solo usar las imágenes del carrusel (base64Images y validUrls), NO las del contenido
      const imagesToSend = [...base64Images, ...validUrls];
      
      console.log("Using compressed content approach - keeping images inline");
      // Compress images in content if we're keeping them inline
      const compressedContenido = await compressImagesInContent(cleanedContenido);
      const finalContenido = compressedContenido;
      
      console.log("Final content length:", finalContenido.length);
      console.log("Final content preview:", finalContenido.substring(0, 200) + "...");
      
      // Combine only carousel images (NOT content images)
      const allImages = imagesToSend;
      
      console.log("Total carousel images:", allImages.length);
      console.log("Content images remain inline in HTML");
      
      // Check if final processing was successful
      if (!finalContenido || finalContenido.trim().length === 0) {
        console.error("Content processing resulted in empty content");
        showToast("error", "Error al procesar el contenido. Intenta nuevamente.");
        return;
      }

      // Sanitize contenido to prevent SQL injection
      const sanitizedContenido = finalContenido
        .replace(/'/g, "''") // Escape single quotes
        .replace(/\\/g, "\\\\"); // Escape backslashes
        
      // Validate sanitized content
      if (!sanitizedContenido || sanitizedContenido.trim().length === 0) {
        console.error("Content sanitization resulted in empty content");
        showToast("error", "Error al procesar el contenido. Intenta nuevamente.");
        return;
      }
      
      // Check content size limits - very strict due to PHP post_max_size = 8MB
      const maxContentSize = 1500000; // 1.5MB máximo total para evitar límite PHP de 8MB (incluyendo otros datos)
      
      // Check if most of the content is images (base64)
      const base64ImageMatches = sanitizedContenido.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g) || [];
      const imageContentSize = base64ImageMatches.join('').length;
      const textContentSize = sanitizedContenido.length - imageContentSize;
      
      console.log(`Content analysis: Total: ${Math.round(sanitizedContenido.length/1000)}KB, Images: ${Math.round(imageContentSize/1000)}KB, Text: ${Math.round(textContentSize/1000)}KB`);
      console.log(`Max allowed: ${Math.round(maxContentSize/1000)}KB (due to PHP post_max_size limit)`);
      
      if (sanitizedContenido.length > maxContentSize) {
        console.error(`Content too large: ${sanitizedContenido.length} characters (max: ${maxContentSize})`);
        if (imageContentSize > 0) {
          showToast("error", `El contenido con imágenes es muy pesado (${Math.round(sanitizedContenido.length/1000)}KB). Máximo: ${Math.round(maxContentSize/1000)}KB. Usa imágenes más pequeñas o menos imágenes en el contenido.`);
        } else {
          showToast("error", `El contenido es demasiado largo (${Math.round(sanitizedContenido.length/1000)}KB). Límite máximo: ${Math.round(maxContentSize/1000)}KB.`);
        }
        return;
      }

      // Check for SVG content that shouldn't be in blog text
      if (sanitizedContenido.includes('<svg') || sanitizedContenido.includes('<?xml')) {
        console.error("SVG or XML content detected in blog content");
        showToast("error", "El contenido contiene código SVG o XML que no es válido para un blog. Por favor usa solo texto e imágenes.");
        return;
      }

      // Create a dataApi object here, after all variables are declared
      const dataToSend: BlogApi = {
        idCategoria: categoriaId,
        tema: tema.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim(), // Sanitizar título: convertir saltos de línea a espacios y normalizar espacios
        contenido: sanitizedContenido, // Contiene HTML con imágenes inline
        imagenes: allImages, // Solo imágenes del carrusel, NO las del contenido
        idPsicologo: finalIdPsicologo,
      };

      console.log("Final data to send:", {
        ...dataToSend,
        contenido: `Content length: ${dataToSend.contenido.length} chars`,
        imagenes: `Array of ${allImages.length} images`, // Log only counts for brevity
      });

      // Additional debugging for content with images
      const contentImages = sanitizedContenido.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g) || [];
      const totalRequestSize = JSON.stringify(dataToSend).length;
      const phpPostLimit = 8000000; // 8MB en bytes (PHP post_max_size)
      
      console.log("Content debugging:", {
        totalContentSize: sanitizedContenido.length,
        contentImagesCount: contentImages.length,
        carouselImagesCount: allImages.length,
        contentImagesSizeKB: contentImages.length > 0 ? Math.round(contentImages.join('').length / 1000) : 0,
        totalRequestSizeKB: Math.round(totalRequestSize / 1000),
        phpPostLimitKB: Math.round(phpPostLimit / 1000),
        willExceedPHPLimit: totalRequestSize > phpPostLimit * 0.9 // 90% del límite
      });

      // Check if total request will exceed PHP limits
      if (totalRequestSize > phpPostLimit * 0.9) { // 90% del límite para margen de seguridad
        console.error(`Total request too large: ${Math.round(totalRequestSize/1000)}KB (PHP limit: ${Math.round(phpPostLimit/1000)}KB)`);
        showToast("error", `La solicitud total es demasiado grande (${Math.round(totalRequestSize/1000)}KB). Límite del servidor: ${Math.round(phpPostLimit * 0.9/1000)}KB. Reduce las imágenes en el contenido o usa menos imágenes.`);
        return;
      }

      // Add validation for required fields
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
      const apiUrl = editingBlogId
        ? `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${editingBlogId}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/blogs`;

      const method = editingBlogId ? "PUT" : "POST";

      console.log("Sending request to:", apiUrl);
      console.log("Method:", method);
      console.log("Data size:", JSON.stringify(dataToSend).length, "characters");
      console.log("Headers:", {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token ? 'TOKEN_EXISTS' : 'NO_TOKEN'}`,
      });
      
      // Log sanitized content details (with safety checks)
      if (sanitizedContenido) {
        console.log("Sanitized content length:", sanitizedContenido.length);
        console.log("Has images in content:", sanitizedContenido.includes('<img'));
        
        // Check for potential problematic characters
        const problematicChars = sanitizedContenido.match(/[^\x00-\x7F]/g);
        if (problematicChars) {
          console.log("Non-ASCII characters found:", problematicChars.length);
        }
      } else {
        console.warn("sanitizedContenido is undefined or null");
      }

      // Show loading toast
      showToast("info", "Enviando datos...");

      let response;
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

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        console.log("Raw response text:", await response.text().catch(() => "Unable to get text"));
        showToast("error", "Error al procesar la respuesta del servidor");
        return; // Exit the function early
      }

      if (response.ok) {
        showToast(
          "success",
          editingBlogId
            ? "Publicación actualizada correctamente"
            : "Publicación creada correctamente",
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!editingBlogId) {
          setTema("");
          setContenido("");
          setBase64Images([]);
          setUrls([]);
          setSelectedKey(null);
        }

        setView(" blogs");
      } else {
        // Enhanced error handling
        let errorMessage = "Error desconocido";

        if (data?.status_message) {
          errorMessage = data.status_message;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.description) {
          errorMessage = data.description;
        }

        // Specific error cases
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

        // Safe logging for server error details (using console.log to avoid Next.js dev tools issues)
        console.log("Server error details:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestUrl: apiUrl,
          requestMethod: method,
          contentLength: JSON.stringify(dataToSend).length,
        });

        // Handle specific server validation messages
        if (data.message) {
          showToast("error", data.message);
        } else {
          showToast("error", errorMessage);
        }
      }
    } catch (error) {
      // Safe logging for submission error (using console.log to avoid Next.js dev tools issues)
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

  const handleEdit = async (id: number) => {
    const blog = await BlogById(id);
    console.log("Blog data for editing:", blog);
    if (blog) {
      // VALIDACIÓN DE PROPIEDAD: Solo el psicólogo propietario puede editar
      const currentPsicologoId = user?.idpsicologo || user?.id;

      if (blog.idPsicologo !== currentPsicologoId) {
        showToast(
          "error",
          "No tienes permisos para editar este blog. Solo puedes editar tus propios blogs.",
        );
        return;
      }
      console.log("Blog idPsicologo:", blog.idPsicologo);
      console.log(
        "Current user can edit?",
        blog.idPsicologo === currentPsicologoId,
      );

      setTema(blog.tema);
      // Handle multiple images
      if (blog.imagenes && Array.isArray(blog.imagenes)) {
        // Separate base64 images from URLs
        const base64Imgs = blog.imagenes.filter((img: string) =>
          img.startsWith("data:image/"),
        );
        const urlImgs = blog.imagenes.filter((img: string) =>
          img.startsWith("http"),
        );

        setBase64Images(base64Imgs);
        setUrls(urlImgs);
      } else if (blog.imagen) {
        // Backward compatibility for a single image
        if (blog.imagen.startsWith("data:image/")) {
          setBase64Images([blog.imagen]);
          setUrls([]);
        } else {
          setBase64Images([]);
          setUrls([blog.imagen]);
        }
      } else {
        setBase64Images([]);
        setUrls([]);
      }
      setContenido(blog.contenido);
      setSelectedKey(blog.idCategoria.toString());
      setEditingBlogId(blog.id);
      setOriginalIdPsicologo(blog.idPsicologo);
      console.log("Set originalIdPsicologo to:", blog.idPsicologo);
      setView("crear");
    }
  };

  const resetForm = useCallback(() => {
    setTema("");
    setContenido("");
    setSelectedKey(null);
    setValue("");
    setBase64Images([]);
    setUrls([]);
    setEditingBlogId(null);
    setOriginalIdPsicologo(null);
  }, []);

  return (
    <div>
      <div className="w-full h-16 bg-[#4d0b73] items-center justify-start flex">
        <div className="ml-10 flex justify-between items-center w-full max-w-[230px] gap-x-3">
          {/* Boton Crear Blog */}
          <Button
            radius="full"
            className={
              view === "crear"
                ? "bg-white text-[16px] leading-[20px] text-[#6364F4] font-bold shadow rounded-[5px]"
                : "bg-[rgba(186,76,216,0.59)] text-[#ecd5ee] text-[16px] leading-[20px] rounded-[5px]"
            }
            onPress={() => {
              setView("crear");
              resetForm();
              setTema("");
              setContenido("");
              setBase64Images([]);
              setUrls([]);
              setSelectedKey(null);
            }}
          >
            Crear Blog
          </Button>

          {/* Boton Ver Blogs */}
          <Button
            onPress={() => setView(" blogs")}
            className={
              view === " blogs"
                ? "bg-white text-[16px] leading-[20px] text-[#6364F4] font-bold shadow rounded-[5px]"
                : "bg-[rgba(186,76,216,0.59)] text-[#ecd5ee] text-[16px] leading-[20px] rounded-[5px]"
            }
          >
            Ver Blogs
          </Button>
        </div>
      </div>

      {view === "crear" ? (
        <div className="flex flex-col md:flex-row gap-10 mx-auto px-10 mt-8 mb-8 max-w-scv18 h-full">
          <div className="flex-1 flex flex-col justify-between gap-y-scv8 items-center w-full  mx-auto bg-slate-200 dark:bg-gray-800 p-scv4">
            {/* Titulo */}
            <div className="w-full">
              <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
                Titulo
              </h1>
              <Textarea
                aria-label="Titulo"
                placeholder="Ingresar Titulo (los saltos de línea se convertirán a espacios al guardar)"
                classNames={{
                  input: "dark:!text-gray-100 whitespace-pre-wrap",
                  inputWrapper:
                    "!bg-white dark:!bg-gray-700 border-2 border-[#634AE2] rounded-lg",
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
                Categoria
              </h1>
              <div className="flex w-full flex-col">
                <Autocomplete
                  className="dark:[&_[data-slot=input-wrapper]]:bg-gray-700 [&_[data-slot=input-wrapper]]:bg-white [&_[data-slot=input-wrapper]]:border-[#634AE2] [&_[data-slot=input-wrapper]]:rounded-lg"
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

              {/* Sección de subida de múltiples imágenes */}
              <div className="w-full flex flex-col gap-2">
                {/* Boton de subir múltiples imágenes */}
                <div className="relative border-2 border-[#634AE2] bg-white dark:bg-gray-700 rounded-lg h-32 w-full flex justify-center items-center cursor-pointer overflow-hidden">
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

                {/* Mostrar imágenes base64 cargadas */}
                {base64Images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {base64Images.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          width={150}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index, "base64")}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón para agregar URL */}
                {base64Images.length + urls.length < 6 && (
                  <Button
                    onPress={addUrlImage}
                    className="bg-[#634AE2] text-white"
                    size="sm"
                  >
                    Agregar imagen por URL
                  </Button>
                )}

                {/* Inputs de URL */}
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <button
                      onClick={() => removeImage(index, "url")}
                      className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                    <Input
                      placeholder={`URL de imagen ${index + 1}`}
                      classNames={{
                        input: "dark:!text-gray-100 ",
                        inputWrapper:
                          "!bg-white dark:!bg-gray-700 border-2 border-[#634AE2] rounded-lg",
                      }}
                      radius="full"
                      height={43}
                      value={url}
                      onChange={(e) => updateUrlImage(index, e.target.value)}
                    />
                  </div>
                ))}

                {/* Mostrar preview de URLs válidas */}
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

                {/* Contador de imágenes */}
                <div className="w-full">
                  <span
                    className={`text-sm font-medium ${
                      base64Images.length +
                        urls.filter((url) => url.trim() !== "").length >=
                      1
                        ? "text-green-600"
                        : "text-red-800 dark:text-[#d66686]"
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
                  : editingBlogId
                    ? "Actualizar"
                    : "Enviar"}
              </Button>
            </div>
          </div>

          <div className="flex-[2] flex flex-col w-full max-w-full bg-slate-200 dark:bg-gray-800 p-scv4">
            <h1 className="mb-scv3 py-scv2 bg-[#634AE2] -ml-scv4 w-[calc(100% + 16px)] font-semibold text-white text-xl rounded-r-[10px] flex items-center justify-start pl-[28px]">
              Descripción
            </h1>
            <div className="w-full flex flex-col grow">
              <Tiptap setContenido={setContenido} contenido={contenido} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-10 mt-14">
          <Listarblog onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}
