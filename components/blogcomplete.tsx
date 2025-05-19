import { useEffect, useState } from "react";
import { BlogPreviewData } from "@/interface";
import { Button, Divider, Form } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogComplete() {
  const [blogs, setBlogs] = useState<BlogPreviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/");
        const data = await response.json();
        if (data.status_code === 200) {
          setBlogs(data.result); // Save the blogs in state
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Cargando blogs...</p>;
  }

  return (
    <>
      <div className="max-w-7xl w-full flex flex-col items-center mx-auto px-4">
        <div className="w-full flex flex-col items-start">
          <div className="flex items-center gap-2 pb-12 pt-6">
            <Link href="/blog">
              <ArrowLeft color="#634AE2" />
            </Link>
            <h1 className="text-[#634AE2] md:text-4xl text-2xl font-semibold">
              Blog
            </h1>
          </div>
        </div>

        {blogs.map((blog) => (
          <div key={blog.idBlog} className="w-full mb-12">
            <Button
              radius="full"
              className="bg-[#EAEAFF] md:m-2 text-base text-[#634AE2]"
            >
              {blog.categoria}
            </Button>
            <div className="text-[#634AE2] w-full">
              <p className="font-semibold md:text-[64px] text-2xl md:leading-[80px] mt-4">
                {blog.tema}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={blog.psicologoImagenId}
                  alt={blog.psicologo || "Avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-normal md:text-base">
                    {blog.psicologo} {blog.psicologApellido}
                  </p>
                  <p className="text-[#634AE2] text-[14px] leading-[20px] font-extralight md:block hidden">
                    Publicado el {new Date(blog.fecha).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Divider className="max-w-7xl mt-8" />
            </div>

            <div className="w-full">
              <img
                className="pt-9 rounded-none mx-auto max-w-7xl"
                src={blog.imagen}
                alt="blogfondo"
                width="100%"
                height="auto"
              />
            </div>

            <div className="max-w-7xl w-full mx-auto px-4">
              <p
                className="md:text-2xl text-sm my-8 text-[#634AE2]"
                dangerouslySetInnerHTML={{ __html: blog.contenido }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}