import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Solo aplicar a rutas de blog individuales
  if (pathname.startsWith('/blog/') && pathname !== '/blog') {
    const blogIdentifier = pathname.split('/')[2];
    
    // Si es un número (ID antiguo), intentar redirigir al slug
    if (blogIdentifier && /^\d+$/.test(blogIdentifier)) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
        const response = await fetch(`${apiUrl}api/blogs/${blogIdentifier}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const blog = data.result;
          
          // Si el blog tiene slug, redirigir a él
          if (blog?.slug && blog.slug !== blogIdentifier) {
            const url = request.nextUrl.clone();
            url.pathname = `/blog/${blog.slug}`;
            return NextResponse.redirect(url, 301); // Redirect permanente
          }
        }
      } catch (error) {
        console.error('Error in blog redirect middleware:', error);
        // En caso de error, continuar sin redirigir
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog/:path*',
  ],
};
