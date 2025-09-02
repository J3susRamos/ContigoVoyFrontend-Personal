import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <FileX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog no encontrado
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Lo sentimos, el artículo que buscas no existe o ha sido eliminado. 
            Te invitamos a explorar otros artículos interesantes en nuestro blog.
          </p>
          
          <Link 
            href="/blog"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#634AE2]/25 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al blog
          </Link>
        </div>
      </div>
    </div>
  );
}
