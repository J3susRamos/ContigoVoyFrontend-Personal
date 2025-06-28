import { Skeleton } from "@heroui/react";
import { Search } from "lucide-react";
import BlogPreview from "./blogpreview";

export default function BlogPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
                Blog
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                Descubre artículos sobre bienestar mental, desarrollo personal y
                salud emocional escritos por nuestros especialistas.
              </p>
            </div>
            {/* Search Bar */}
            <Skeleton className="relative lg:w-96 rounded-2xl">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
              />
            </Skeleton>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div
            className={`lg:col-span-1 block`}
          >
            <div className="sticky top-6 h-full">
              <Skeleton className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10 h-full"></Skeleton>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((item, index) => (
                <Skeleton
                  key={index + "itemShow"}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10 h-scv14"
                ></Skeleton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
