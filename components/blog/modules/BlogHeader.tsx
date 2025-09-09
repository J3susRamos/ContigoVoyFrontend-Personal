import { Search } from "lucide-react";

interface BlogHeaderProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export default function BlogHeader({ searchTerm, onSearch }: BlogHeaderProps) {
  return (
    <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
            Descubre artículos sobre bienestar mental, desarrollo personal y salud emocional escritos por nuestros especialistas.
          </p>
        </div>

        <div className="relative lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 