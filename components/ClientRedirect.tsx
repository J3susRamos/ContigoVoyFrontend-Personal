'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function ClientRedirectContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redireccionar URLs antiguas del blog con query params a la nueva estructura de rutas dinámicas
    if (pathname === '/blog/plantilla' || pathname === '/blog/ver') {
      const blogParam = searchParams.get('blog');
      if (blogParam) {
        // Redirigir de /blog/plantilla?blog=xxx o /blog/ver?blog=xxx a /blog/xxx
        router.replace(`/blog/${blogParam}`);
        return;
      }
    }
  }, [pathname, searchParams, router]);

  return null;
}

export default function ClientRedirect() {
  return (
    <Suspense fallback={null}>
      <ClientRedirectContent />
    </Suspense>
  );
}
