"use client";

import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Listarblog } from "./listarblog";
import Tiptap from "./textEdit";
import { BlogApi, Categoria, UsuarioLocalStorage } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "../ToastStyle";
import { convertImageToWebP, convertToBase64 } from "@/utils/convertir64";
import { Plus } from "lucide-react";
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
      }
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
      }
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
  const [url, setUrl] = useState("");
  const [view, setView] = useState("crear");
  const [contenido, setContenido] = useState("");
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [value, setValue] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [originalIdPsicologo, setOriginalIdPsicologo] = useState<number | null>(
    null
  );
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoria = () => {
      CategoriaGet()
        .then(data => setCategoria(data))
        .catch(error => console.error("Failed to fetch categories:", error));
    };
    fetchCategoria();
  }, []);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      console.log("Stored user from localStorage:", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      }
    };
    fetchUser();
  }, []);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("error", "Por favor selecciona un archivo de imagen válido.");
      return;
    }

    try {
      showToast("info", "Procesando imagen...");
        // Convertir la imagen a WebP con compresión
      const webpImage = await convertImageToWebP(file); // La función ya tiene 80% quality por defecto

      // Convertir la imagen WebP a Base64
      const base64 = await convertToBase64(webpImage);
      
      // Check final base64 size
      if (base64.length > 400000) { // 400KB limit for base64
        showToast("error", "La imagen procesada sigue siendo muy grande. Intenta con una imagen más pequeña.");
        return;
      }
      
      setBase64Image(base64);
      setUrl(""); // Clear URL input when uploading an image
      showToast("success", "Imagen cargada correctamente.");
      
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("error", "Error al procesar la imagen. Intenta nuevamente.");
    }
  };

  const postNewCategoria = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
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
        }
      );
      const info = await response.json();
      setSelectedKey(info.result.idCategoria);
      return info.result.idCategoria;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

const handleSubmit = async () => {
  try {
    // Validate required fields
    if (!user?.id) {
      showToast("error", "Usuario no identificado. Por favor inicia sesión nuevamente.");
      return;
    }

    // Validate tema length
    if (!tema || tema.trim().length < 5) {
      showToast("error", "El título debe tener al menos 5 caracteres.");
      return;
    }

    if (tema.length > 200) {
      showToast("error", "El título no puede exceder 200 caracteres.");
      return;
    }

    // Validate contenido length
    if (!contenido || contenido.replace(/<[^>]*>/g, '').trim().length < 50) {
      showToast("error", "El contenido debe tener al menos 50 caracteres de texto.");
      return;
    }

    if (contenido.length > 50000) {
      showToast("error", "El contenido es demasiado largo. Máximo 50,000 caracteres.");
      return;
    }

    // Validate image
    if (!base64Image && !url) {
      showToast("error", "Debes agregar una imagen (subir archivo o URL).");
      return;
    }

    // Validate image size more strictly
    if (base64Image) {
      // Check if base64 is too large (reduce limit)
      if (base64Image.length > 500000) { // 500KB limit for base64
        showToast("error", "La imagen es demasiado grande. Por favor selecciona una imagen más pequeña (máx. 500KB).");
        return;
      }
      
      // Validate base64 format
      if (!base64Image.startsWith('data:image/')) {
        showToast("error", "Formato de imagen inválido. Por favor selecciona una imagen válida.");
        return;
      }
    }

    // Validate URL format if using URL
    if (url && !url.startsWith('http')) {
      showToast("error", "La URL de la imagen debe comenzar con http:// o https://");
      return;
    }

    // Debug logging
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
      showToast("error", "Error al procesar la categoría. Intenta nuevamente.");
      return;
    }

    // Use idpsicologo instead of user id for blog operations
    const finalIdPsicologo = user.idpsicologo || user.id;
    
    console.log("Final ID Psicologo to use:", finalIdPsicologo);

    // Sanitize contenido to prevent SQL injection
    const sanitizedContenido = contenido
      .replace(/'/g, "''") // Escape single quotes
      .replace(/\\/g, "\\\\"); // Escape backslashes

    // Create a dataApi object here, after all variables are declared
    const dataToSend: BlogApi = {
      idCategoria: categoriaId,
      tema: tema.trim(),
      contenido: sanitizedContenido,
      imagen: base64Image || url,
      idPsicologo: finalIdPsicologo,
    };

    console.log("Final data to send:", {
      ...dataToSend,
      imagen: dataToSend.imagen.substring(0, 100) + "..." // Log only first 100 chars of image
    });

    // Add validation for required fields
    if (!dataToSend.idPsicologo) {
      showToast("error", "Error: ID de psicólogo no válido.");
      return;
    }

    const cookies = parseCookies();
    const token = cookies["session"];

    if (!token) {
      showToast("error", "Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }    const apiUrl = editingBlogId
      ? `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${editingBlogId}`
      : `${process.env.NEXT_PUBLIC_API_URL}api/blogs`;

    const method = editingBlogId ? "PUT" : "POST";

    console.log("Sending request to:", apiUrl);
    console.log("Method:", method);
    console.log("Data size:", JSON.stringify(dataToSend).length, "characters");

    // Show loading toast
    showToast("info", "Enviando datos...");

    const response = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    let data;
    try {
      data = await response.json();
      console.log("Response data:", data);
    } catch (parseError) {
      console.error("Error parsing response JSON:", parseError);
      throw new Error("Error al procesar la respuesta del servidor");
    }

    if (response.ok) {
      showToast(
        "success",
        editingBlogId
          ? "Publicación actualizada correctamente"
          : "Publicación creada correctamente"
      );
      
      // Reset form
      setTema("");
      setContenido("");
      setBase64Image(null);
      setUrl("");
      setSelectedKey(null);
      
      // Optional: reload after success
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
        errorMessage = "El archivo es demasiado grande. Reduce el tamaño de la imagen.";
      } else if (response.status === 422) {
        errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos.";
      } else if (response.status === 500) {
        errorMessage = "Error interno del servidor. Intenta con una imagen más pequeña o verifica el contenido.";
      }

      console.error("Server error details:", {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      showToast("error", errorMessage);
    }
  } catch (error) {
    console.error("Client error:", error);
    
    let errorMessage = "Error de conexión. Intenta nuevamente.";
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "Error de conexión con el servidor. Verifica tu conexión a internet.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    showToast("error", errorMessage);
  }
};

const handleEdit = async (id: number) => {
  const blog = await BlogById(id);
  console.log("Blog data for editing:", blog);
  if (blog) {
    // Check if the blog has a valid idPsicologo
    console.log("Blog idPsicologo:", blog.idPsicologo);
    console.log("Current user can edit?", blog.idPsicologo === user?.id || !blog.idPsicologo);
    
    setTema(blog.tema);
    setUrl(blog.imagen);
    setBase64Image(null); // Reset base64 image when editing
    setContenido(blog.contenido);
    setSelectedKey(blog.idCategoria.toString());
    setEditingBlogId(blog.id);
    setOriginalIdPsicologo(blog.idPsicologo);
    console.log("Set originalIdPsicologo to:", blog.idPsicologo);
    setView("crear");
  }
};

  return (
    <div>
      <div className="w-full h-16 bg-[#6364F4] items-center justify-start flex">
        <div className="ml-10 flex justify-between items-center w-full max-w-[230px]">
          {/* Boton Crear Blog */}
          <Button
            radius="full"
            className="bg-white text-[16px] leading-[20px] text-[#634AE2] font-bold"
            onPress={() => {
              setView("crear");
              setEditingBlogId(null);
              setOriginalIdPsicologo(null);
            }}
          >
            Crear Blog
          </Button>

          {/* Boton Ver Blogs */}
          <Button
            onPress={() => setView(" blogs")}
            className="text-white text-[16px] leading-[20px] bg-[#634AE2] a"
          >
            Ver Blogs
          </Button>
        </div>
      </div>

      {view === "crear" ? (
        <div className="flex flex-col md:flex-row gap-10 mx-10 mt-14">
          <div className="flex flex-col items-center w-full max-w-[500px] gap-y-3 mx-auto">
            {/* Titulo */}
            <h1 className="h-10 bg-[#6364F4] w-full font-semibold text-white text-xl rounded-full flex items-center justify-start pl-3">
              Titulo
            </h1>
            <Input
              aria-label="Titulo"
              placeholder="Ingresar Titulo"
              classNames={{
                input: "!text-[#634AE2] ",
              }}
              radius="full"
              height={43}
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            />

            {/* Categoria */}
            <h1 className="h-10 bg-[#6364F4] w-full font-semibold text-white text-xl rounded-full flex items-center justify-start pl-3">
              Categoria
            </h1>
            <div className="flex w-full flex-col">
              <Autocomplete
                radius="full"
                inputProps={{
                  className: "!text-[#634AE2]",
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

            {/* Imagen */}
            <h1 className="h-10 bg-[#6364F4] w-full font-semibold text-white text-xl rounded-full flex items-center justify-start pl-3">
              Imagen
            </h1>
            
            {/* Seccion de subida de imagen */}
            <div className="w-full flex flex-col gap-2">
              {/* Boton de subir imagen */}
              <div className="relative border-2 border-[#634AE2] rounded-lg h-32 w-full flex justify-center items-center cursor-pointer overflow-hidden">
                {base64Image ? (
                  <Image
                    src={base64Image}
                    alt="Imagen seleccionada"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : url ? (
                  <Image
                    src={url}
                    alt="Imagen desde URL"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Plus width={40} height={40} strokeWidth={2} className="text-[#634AE2]" />
                    <span className="text-[#634AE2] text-sm mt-2">Subir imagen</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* OR separator */}
              <div className="flex items-center justify-center my-2">
                <span className="text-[#634AE2] text-sm">Tambien puedes colocar el URL</span>
              </div>

              {/* URL Input */}
              <Input
                placeholder="Url de imagen"
                classNames={{
                  input: "!text-[#634AE2]",
                }}
                radius="full"
                height={43}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setBase64Image(null); // Clear uploaded image when typing URL
                }}
              />
            </div>
          </div>

          <div className="w-full max-w-full md:max-w-[50%]">
            <h1 className="h-10 bg-[#6364F4] w-full font-semibold text-white text-xl rounded-full flex items-center justify-start pl-3">
              Descripción
            </h1>
            <div className="py-4 w-full">
              <Tiptap setContenido={setContenido} contenido={contenido} />
              <div className="flex pt-4 justify-center md:justify-end">
                <Button
                  onPress={handleSubmit}
                  radius="full"
                  className="text-white bg-[#634AE2] w-full max-w-32 font-normal text-sm"
                >
                  {editingBlogId ? "Actualizar" : "Enviar"}
                </Button>
              </div>
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
