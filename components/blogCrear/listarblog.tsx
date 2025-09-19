import { BlogApiGEt, UsuarioLocalStorage } from "@/interface";
import { Image } from "@heroui/react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

export const BlogGet = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/blogs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();

    if (Array.isArray(data.result)) {
      return data.result;
    } else {
      console.error("La respuesta de la API no es un array:", data);
      console.log(data.result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};


export const BlogGetByPsicologo = async (idPsicologo: number) => {
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    
    if (!token) {
      console.error("No hay token de sesión");
      return [];
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/blogs/psicologo/${idPsicologo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Error en la respuesta:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data.result)) {
      return data.result;
    } else {
      console.error("La respuesta de la API no es un array:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching blogs by psicologo:", error);
    return [];
  }
};

export const eliminarBlog = async (id: number | null) => {
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle error response without throwing
      const errorData = await response.json().catch(() => ({}));
      console.error("Delete failed:", errorData);
      return { success: false, error: errorData.message || "Error deleting blog" };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export function Listarblog({
  onEdit,
}: {
  onEdit: (id: number) => Promise<void>;
}) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bloge, setBlog] = useState<BlogApiGEt[]>([]);
  const [currentUser, setCurrentUser] = useState<UsuarioLocalStorage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual del localStorage
    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      }
    };
    fetchUser();
  }, []);  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        console.log("Current user:", currentUser);
        if (currentUser?.idpsicologo) {
          console.log("Fetching blogs for psicologo:", currentUser.idpsicologo);
          const Data = await BlogGetByPsicologo(currentUser.idpsicologo);
          console.log("Blogs received:", Data);
          setBlog(Data);
        } else if (currentUser?.id) {
          console.log("Fetching blogs for user ID:", currentUser.id);
          const Data = await BlogGetByPsicologo(currentUser.id);
          console.log("Blogs received:", Data);
          setBlog(Data);
        } else {
          // FALLBACK TEMPORAL: Si no hay usuario específico, usar función original
          console.log("No specific user, using original function as fallback");
          const Data = await BlogGet();
          console.log("Fallback blogs received:", Data);
          setBlog(Data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // FALLBACK EN CASO DE ERROR: usar función original
        console.log("Error occurred, using original function as fallback");
        try {
          const Data = await BlogGet();
          console.log("Error fallback blogs received:", Data);
          setBlog(Data);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [currentUser]);
  const handleEliminarBlog = async (id: number | null) => {
    const result = await eliminarBlog(id);
    if (result.success) {
      // Actualizar lista con blogs del psicólogo actual
      if (currentUser?.idpsicologo) {
        const updatedBlogs = await BlogGetByPsicologo(currentUser.idpsicologo);
        setBlog(updatedBlogs);
      } else if (currentUser?.id) {
        const updatedBlogs = await BlogGetByPsicologo(currentUser.id);
        setBlog(updatedBlogs);
      }
    } else {
      console.error("Error deleting blog:", result.error);
    }
  };

  const handleEditarBlog = async (id: number | null) => {
    if (id !== null) {
      try {
        await onEdit(id);
      } catch (error) {
        console.error("Error editing blog:", error);
      }
    }
  };

  const confirmDelete = async () => {
    await handleEliminarBlog(deleteId);
    setDeleteId(null);
  };
  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-[#634AE2] text-lg">Cargando tus blogs...</div>
        </div>
      ) : bloge.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-8 text-center">
          <div className="text-[#634AE2] text-xl font-semibold mb-2">
            ¡Aún no has creado ningún blog!
          </div>
          <div className="text-gray-600 text-sm">
            Comparte tu conocimiento y experiencia creando tu primer blog.
          </div>
        </div>
      ) : (
        <>
          {/* Desktop: tabla como antes */}
          <div className="hidden lg:block">
            <table className="w-full border-separate border-spacing-y-4 rounded-t-lg rounded-2xl">
              <thead className="rounded-[36px]">
                <tr className="bg-opacity-0 text-white h-11 rounded-[36px]">
                  <th className="rounded-tl-[36px] font-normal bg-[#6364F4]">ID</th>
                  <th className="font-normal bg-[#6364F4]">Tema</th>
                  <th className="font-normal bg-[#6364F4]">Categoria</th>
                  <th className="font-normal bg-[#6364F4]">Imagen</th>
                  <th className="rounded-tr-[36px] font-normal bg-[#6364F4]">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center text-[#634AE2] font-normal text-[16px] leading-[20px]">
                {bloge.map((blog) => (
                  <tr key={blog.idBlog} style={{clipPath: 'xywh(0 0 100% 100% round 24px)'}} className="border-b bg-white dark:bg-input dark:text-foreground rounded-[36px] ">
                    <td className="px-4 py-2 border-b-4 border-[#634AE2]">{blog.idBlog}</td>
                    <td className="px-4 py-2 border-b-4 border-[#634AE2]">{blog.tema}</td>
                    <td className="px-4 py-2 border-b-4 border-[#634AE2]">{blog.categoria}</td>
                    <td className="px-4 py-2 flex justify-center items-center border-b-4 border-[#634AE2]">
                      <div className="relative">
                        <Image
                          isZoomed
                          width={120}
                          height={70}
                          radius="none"
                          src={blog.imagenes?.[0] || blog.imagen}
                          alt="Imagen principal del blog"
                          className="object-cover"
                        />
                        {blog.imagenes && blog.imagenes.length > 1 && (
                          <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                            +{blog.imagenes.length - 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 rounded-r-[34px] border-b-4 border-[#634AE2]">
                      <div className="flex flex-row items-center justify-center gap-x-4">
                        <div className="">
                          <button
                            onClick={() => handleEditarBlog(blog.idBlog)}
                            className="flex flex-col items-center justify-center hover:opacity-75"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="34px"
                              viewBox="0 -960 960 960"
                              width="34px"
                              fill="#634AE2"
                            >
                              <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                            </svg>
                            <h1 className="font-light text-sm">Editar</h1>
                          </button>
                        </div>
                        <div className="">
                          <button
                            onClick={() => setDeleteId(blog.idBlog)}
                            className="flex flex-col items-center justify-center hover:opacity-75"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="34px"
                              viewBox="0 -960 960 960"
                              width="34px"
                              fill="#B158FF"
                            >
                              <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                            </svg>
                            <h1 className="text-[#B158FF] font-light text-sm">Eliminar</h1>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile/Tablet: grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 lg:hidden">
            {bloge.map((blog) => (
              <Card key={blog.idBlog} className="flex flex-col h-full">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">ID: {blog.idBlog}</span>
                  </div>
                  <CardTitle className="text-lg text-[#634AE2] truncate" title={blog.tema}>{blog.tema}</CardTitle>
                  <CardDescription className="truncate">{blog.categoria}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-4 pt-0">
                  <div className="relative w-full flex justify-center">
                    <Image
                      isZoomed
                      width={180}
                      height={100}
                      radius="none"
                      src={blog.imagenes?.[0] || blog.imagen}
                      alt="Imagen principal del blog"
                      className="object-cover rounded-lg w-full h-[120px]"
                    />
                    {blog.imagenes && blog.imagenes.length > 1 && (
                      <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                        +{blog.imagenes.length - 1}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center justify-between gap-x-2 p-4 pt-0">
                  <button
                    onClick={() => handleEditarBlog(blog.idBlog)}
                    className="flex flex-col items-center justify-center hover:opacity-75"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#634AE2"
                    >
                      <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                    </svg>
                    <span className="font-light text-xs">Editar</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(blog.idBlog)}
                    className="flex flex-col items-center justify-center hover:opacity-75"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="28px"
                      viewBox="0 -960 960 960"
                      width="28px"
                      fill="#B158FF"
                    >
                      <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                    </svg>
                    <span className="text-[#B158FF] font-light text-xs">Eliminar</span>
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de eliminar este blog?"
      />
    </div>
  );
}
