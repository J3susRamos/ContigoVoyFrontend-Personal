import { Categoria, Authors } from "@/interface";

interface FilterTagsProps {
  activeCategories: number[];
  activeAuthors: number[];
  searchTerm: string;
  Categories: Categoria[];
  Authors: Authors[];
  onCategoryFilter: (categoryId: number) => void;
  onAuthorFilter: (authorId: number) => void;
  onSearch: (value: string) => void;
  onClearAll: () => void;
}

export default function FilterTags({
  activeCategories,
  activeAuthors,
  searchTerm,
  Categories,
  Authors,
  onCategoryFilter,
  onAuthorFilter,
  onSearch,
  onClearAll
}: FilterTagsProps) {
  if (activeCategories.length === 0 && activeAuthors.length === 0 && !searchTerm) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtros activos:</span>

      {activeCategories.map(categoryId => {
        const category = Categories.find(cat => cat.idCategoria === categoryId);
        return category ? (
          <span key={categoryId} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
            {category.nombre}
            <button
              onClick={() => onCategoryFilter(categoryId)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              ×
            </button>
          </span>
        ) : null;
      })}

      {activeAuthors.map(authorId => {
        const author = Authors.find(a => a.id === authorId);
        return author ? (
          <span key={authorId} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
            {author.name}
            <button
              onClick={() => onAuthorFilter(authorId)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              ×
            </button>
          </span>
        ) : null;
      })}

      {searchTerm && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-full text-sm font-medium shadow-lg">
          &ldquo;{searchTerm}&rdquo;
          <button
            onClick={() => onSearch("")}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            ×
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className="text-sm text-[#634AE2] hover:text-[#4f46e5] underline font-medium transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  );
} 