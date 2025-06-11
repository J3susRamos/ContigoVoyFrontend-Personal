import { BlogApiGEt } from "@/interface";
import { Image } from "@heroui/react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

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
  const [bloge, setBlog] = useState<BlogApiGEt[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const Data = await BlogGet();
      setBlog(Data);
    };
    fetchBlogs().catch(error => {
      console.error("Error fetching blogs:", error);
    });
  }, []);

  const handleEliminarBlog = async (id: number | null) => {
    const result = await eliminarBlog(id);
    if (result.success) {
      const updatedBlogs = await BlogGet();
      setBlog(updatedBlogs);
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

  return (
    <div className="max-h-[500px] overflow-y-auto overflow-scroll:scrollbar-none">
      <table className="w-full border-separate border-spacing-y-4 ">
        <thead className="rounded-full">
          <tr className="bg-[#6364F4] text-white h-11 ">
            <th className="rounded-tl-full font-normal">ID</th>
            <th className="font-normal">Tema</th>
            <th className="font-normal">Categoria</th>
            <th className="font-normal">Imagen</th>
            <th className="rounded-tr-full font-normal">Acciones</th>
          </tr>
        </thead>

        <tbody className="text-center   bg-white text-[#634AE2] font-normal text-[16px] leading-[20px]  ">
          {bloge.map((blog) => (
            <tr key={blog.idBlog} className="border-b hover:bg-gray-100  ">
              <td className="px-4 py-2 rounded-l-[34px]">{blog.idBlog}</td>
              <td className="px-4 py-2 ">{blog.tema}</td>
              <td className="px-4 py-2">{blog.categoria}</td>
              <td className="px-4 py-2 flex justify-center items-center">
                <Image
                  isZoomed
                  width={120}
                  height={70}
                  radius="none"
                  src={blog.imagen}
                  alt="Imagen de blog"
                />
              </td>
              <td className="px-4 py-2 rounded-r-[34px]">
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
                      onClick={() => handleEliminarBlog(blog.idBlog)}
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
                      <h1 className="text-[#B158FF] font-light text-sm">
                        Eliminar
                      </h1>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
