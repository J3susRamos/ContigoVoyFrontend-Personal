'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function ClientRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redireccionar URLs antiguas del blog a la nueva estructura
    if (pathname.startsWith('/blog/') && pathname !== '/blog' && pathname !== '/blog/ver') {
      const slug = pathname.replace('/blog/', '');
      
      // Si es /blog/plantilla, mantener el parámetro y redirigir a /blog/ver
      if (slug === 'plantilla') {
        const blogParam = searchParams.get('blog');
        if (blogParam) {
          router.replace(`/blog/ver?blog=${blogParam}`);
          return;
        }
      }
      
      // Para cualquier otra ruta de blog, redirigir a /blog/ver con el slug como parámetro
      if (slug && slug !== 'ver') {
        router.replace(`/blog/ver?blog=${slug}`);
      }
    }
  }, [pathname, searchParams, router]);

  return null; // Este componente no renderiza nada
}
