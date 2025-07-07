"use client";

import {Autocomplete, AutocompleteItem, Button, Input} from "@heroui/react";
import React, {useCallback, useEffect, useState} from "react";
import {Listarblog} from "./listarblog";
import Tiptap from "./textEdit";
import {BlogApi, Categoria, UsuarioLocalStorage} from "@/interface";
import {parseCookies} from "nookies";
import showToast from "../ToastStyle";
import {convertImageToWebP, convertToBase64} from "@/utils/convertir64";
import {Plus} from "lucide-react";
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
    const [urls, setUrls] = useState<string[]>([]); // Array de URL
    const [view, setView] = useState("crear");
    const [contenido, setContenido] = useState("");
    const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
    const [value, setValue] = useState("");
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
    const [originalIdPsicologo, setOriginalIdPsicologo] = useState<number | null>(
        null
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
            console.error('Error fetching categories:', error);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const fetchUser = () => {
            try {
                if (typeof window !== 'undefined') {
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

    const handleImageUpload = useCallback(async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Verificar que no exceda el límite de 6 imágenes
        const currentImageCount = base64Images.length + urls.filter(url => url.trim() !== '').length;
        const newImageCount = currentImageCount + files.length;

        if (newImageCount > 6) {
            showToast("error", `No puede agregar más de 6 imágenes. Actualmente tiene ${currentImageCount} imágenes.`);
            return;
        }

        const newBase64Images: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            //Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showToast("error", `La imagen ${file.name} es demasiado grande. Máximo 5MB.`);
                continue;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
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
                    showToast("error", `La imagen ${file.name} procesada sigue siendo muy grande. Intenta con una imagen más pequeña.`);
                    continue;
                }

                newBase64Images.push(base64);

            } catch (error) {
                console.error(`Error processing image ${file.name}:`, error);
                showToast("error", `Error al procesar ${file.name}. Intenta nuevamente.`);
            }
        }

        if (newBase64Images.length > 0) {
            setBase64Images(prev => [...prev, ...newBase64Images]);
            showToast("success", `${newBase64Images.length} imagen(es) cargada(s) correctamente.`);
        }
    }, [base64Images, urls]);

    const removeImage = (index: number, type: 'base64' | 'url') => {
        if (type === 'base64') {
            setBase64Images(prev => prev.filter((_, i) => i !== index));
        } else {
            setUrls(prev => prev.filter((_, i) => i !== index));
        }
    };

    const addUrlImage = () => {
        const currentImageCount = base64Images.length + urls.filter(url => url.trim() !== '').length;

        if (currentImageCount >= 6) {
            showToast("error", "No puede agregar más de 6 imágenes.");
            return;
        }

        setUrls(prev => [...prev, ""]);
    };

    const updateUrlImage = (index: number, value: string) => {
        setUrls(prev => prev.map((url, i) => i === index ? value : url));
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
                    body: JSON.stringify({nombre: value}),
                }
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
        // Validate title - server requires at least 20 characters
        if (!tema.trim()) {
            showToast("error", "El título es requerido.");
            return false;
        }

        if (tema.trim().length < 20) {
            showToast("error", "El título debe tener al menos 20 caracteres.");
            return false;
        }

        // Validate content - server requires at least 10 characters
        if (!contenido.trim()) {
            showToast("error", "El contenido es requerido.");
            return false;
        }

        // Get actual text content without HTML tags
        const getTextContent = (html: string) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.textContent || tempDiv.innerText || '';
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
        const validUrls = urls.filter(url => url.trim() !== '' && url.startsWith('http'));
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
                showToast("error", "Usuario no identificado. Por favor inicia sesión nuevamente.");
                return;
            }

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

            // Validate images - minimum 1, maximum 6
            const validUrls = urls.filter(url => url.trim() !== '' && url.startsWith('http'));
            const totalImages = base64Images.length + validUrls.length;
            if (totalImages < 1) {
                showToast("error", "Debe agregar al menos 1 imagen para crear el blog.");
                return;
            }

            if (totalImages > 6) {
                showToast("error", "No puede agregar más de 6 imágenes.");
                return;
            }

            // Validate base64 images size
            for (let i = 0; i < base64Images.length; i++) {
                if (base64Images[i].length > 500000) {
                    showToast("error", `La imagen ${i + 1} es demasiado grande. Por favor selecciona una imagen más pequeña (máx. 500KB).`);
                    return;
                }

                if (!base64Images[i].startsWith('data:image/')) {
                    showToast("error", `Formato de imagen ${i + 1} inválido. Por favor selecciona una imagen válida.`);
                    return;
                }
            }

            // Validate URL format if using URLs
            for (let i = 0; i < validUrls.length; i++) {
                if (!validUrls[i].startsWith('http')) {
                    showToast("error", `La URL de la imagen ${i + 1} debe comenzar con http:// o https://`);
                    return;
                }
            }

            // Combine all images
            const allImages = [...base64Images, ...validUrls];

            // Debug logging
            console.log("Current user:", user);
            console.log("User ID:", user.id);
            console.log("User idpsicologo:", user.idpsicologo);
            console.log("Original ID Psicologo from blog:", originalIdPsicologo);
            console.log("Editing blog ID:", editingBlogId);
            console.log("Total images:", allImages.length);

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

            // Use id psicologo instead of user id for blog operations
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
                imagenes: allImages, // Enviar array de imágenes
                idPsicologo: finalIdPsicologo,
            };

            console.log("Final data to send:", {
                ...dataToSend,
                imagenes: `Array of ${allImages.length} images` // Log only counts for brevity
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
            }
            const apiUrl = editingBlogId
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
                showToast("error", "Error al procesar la respuesta del servidor");
                return; // Exit the function early
            }

            if (response.ok) {
                showToast(
                    "success",
                    editingBlogId
                        ? "Publicación actualizada correctamente"
                        : "Publicación creada correctamente"
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

                // Handle specific server validation messages
                if (data.message) {
                    showToast("error", data.message);
                } else {
                    showToast("error", errorMessage);
                }
            }
        } catch (error) {
            console.error("Submission error:", error);

            let errorMessage = "Error inesperado. Por favor intenta nuevamente.";

            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = "Error de conexión con el servidor. Verifica tu conexión a internet.";
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
      showToast("error", "No tienes permisos para editar este blog. Solo puedes editar tus propios blogs.");
      return;
    }
            console.log("Blog idPsicologo:", blog.idPsicologo);
            console.log("Current user can edit?", blog.idPsicologo === currentPsicologoId);

            setTema(blog.tema);
            // Handle multiple images
            if (blog.imagenes && Array.isArray(blog.imagenes)) {
                // Separate base64 images from URLs
                const base64Imgs = blog.imagenes.filter((img: string) => img.startsWith('data:image/'));
                const urlImgs = blog.imagenes.filter((img: string) => img.startsWith('http'));

                setBase64Images(base64Imgs);
                setUrls(urlImgs);
            } else if (blog.imagen) {
                // Backward compatibility for a single image
                if (blog.imagen.startsWith('data:image/')) {
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
            <div className="w-full h-16 bg-[#6364F4] items-center justify-start flex">
                <div className="ml-10 flex justify-between items-center w-full max-w-[230px]">
                    {/* Boton Crear Blog */}
                    <Button
                        radius="full"
                        className="bg-white text-[16px] leading-[20px] text-[#634AE2] font-bold"
                        onPress={() => {
                            setView("crear");
                            resetForm();
                            // Reset form
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
                            Imágenes (Mínimo 1, Máximo 6)
                        </h1>

                        {/* Contador de imágenes */}
                        <div className="w-full text-center">
                            <span className={`text-sm font-medium ${
                                (base64Images.length + urls.filter(url => url.trim() !== '').length) >= 1
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                Imágenes agregadas: {base64Images.length + urls.filter(url => url.trim() !== '').length}/6
                            </span>
                        </div>

                        {/* Sección de subida de múltiples imágenes */}
                        <div className="w-full flex flex-col gap-2">
                            {/* Boton de subir múltiples imágenes */}
                            <div
                                className="relative border-2 border-[#634AE2] rounded-lg h-32 w-full flex justify-center items-center cursor-pointer overflow-hidden">

                                <div className="flex flex-col items-center">
                                    <Plus width={40} height={40} strokeWidth={2} className="text-[#634AE2]"/>
                                    <span
                                        className="text-[#634AE2] text-sm mt-2">Subir imágenes (máximo {6 - base64Images.length - urls.filter(url => url.trim() !== '').length})</span>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={base64Images.length + urls.filter(url => url.trim() !== '').length >= 6}
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
                                                onClick={() => removeImage(index, 'base64')}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>)}

                            {/* Botón para agregar URL */}
                            {(base64Images.length + urls.filter(url => url.trim() !== '').length) < 6 && (
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
                                    <Input
                                        placeholder={`URL de imagen ${index + 1}`}
                                        classNames={{
                                            input: "!text-[#634AE2]",
                                        }}
                                        radius="full"
                                        height={43}
                                        value={url}
                                        onChange={(e) => updateUrlImage(index, e.target.value)}
                                    />
                                    <button
                                        onClick={() => removeImage(index, 'url')}
                                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* Mostrar preview de URLs válidas */}
                            {urls.filter(url => url.trim() !== '' && url.startsWith('http')).length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {urls.filter(url => url.trim() !== '' && url.startsWith('http')).map((url, index) => (
                                        <div key={index} className="relative">
                                            <Image
                                                src={url}
                                                alt={`URL Imagen ${index + 1}`}
                                                width={150}
                                                height={100}
                                                className="w-full h-24 object-cover rounded-lg"
                                                onError={() => showToast("error", `Error cargando imagen ${index + 1} desde URL`)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full max-w-full md:max-w-[50%]">
                        <h1 className="h-10 bg-[#6364F4] w-full font-semibold text-white text-xl rounded-full flex items-center justify-start pl-3">
                            Descripción
                        </h1>
                        <div className="py-4 w-full">
                            <Tiptap setContenido={setContenido} contenido={contenido}/>
                            <div className="flex pt-4 justify-center md:justify-end">
                                <Button
                                    onPress={handleSubmit}
                                    radius="full"
                                    className="text-white bg-[#634AE2] w-full max-w-32 font-normal text-sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Procesando..." : (editingBlogId ? "Actualizar" : "Enviar")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mx-10 mt-14">
                    <Listarblog onEdit={handleEdit}/>
                </div>
            )}
        </div>
    );
}
