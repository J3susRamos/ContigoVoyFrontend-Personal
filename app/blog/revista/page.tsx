"use client";
import LoadingPages from "@/components/LoadingPages";
import { BlogPreviewData } from "@/interface";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

function RevistaContent() {
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const [blogData, setBlogData] = useState<BlogPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/blogs/${blogId}`
        );
        const data = await response.json();
        setBlogData(data.result);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the async function and handle the returned promise
    fetchData().catch(error => {
      console.error("Error in fetchData:", error);
    });
  }, [blogId]);

  if (loading) return <div><LoadingPages/></div>;
  if (!blogData) return <div>No se encontró el blog</div>;

  //return <BlogComplete data={blogData} />;
}

export default function Revista() {
  return (
    <Suspense fallback={<div><LoadingPages/></div>}>
      <RevistaContent />
    </Suspense>
  );
}
