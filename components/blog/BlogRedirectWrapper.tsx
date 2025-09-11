'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BlogPreviewData } from '@/interface';

interface BlogRedirectWrapperProps {
  blog: BlogPreviewData;
  currentSlug: string;
  children: React.ReactNode;
}

export default function BlogRedirectWrapper({ 
  blog, 
  currentSlug, 
  children 
}: BlogRedirectWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    // Si el slug actual es un ID numérico pero el blog tiene un slug descriptivo
    if (/^\d+$/.test(currentSlug) && blog.slug && blog.slug !== currentSlug) {
      // Redirigir al slug descriptivo
      router.replace(`/blog/${blog.slug}`, { scroll: false });
      return;
    }
  }, [blog.slug, currentSlug, router]);

  // Si estamos en una redirección, mostrar loading
  if (/^\d+$/.test(currentSlug) && blog.slug && blog.slug !== currentSlug) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#634AE2] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
