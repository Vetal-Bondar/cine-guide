"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/movies/MovieCard";
import { getTrendingMovies, searchMulti } from "@/services/tmdb";
import { Search, Film, Loader2 } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Живий пошук
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      if (searchQuery.trim()) {
        const results = await searchMulti(searchQuery); //мульти-пошук
        setMovies(results);
      } else {
        const data = await getTrendingMovies(); // Якщо пусто - повертаємо тренди
        setMovies(data);
      }
      setIsLoading(false);
    }, 800);

    // Очищаємо таймер
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    const results = await searchMulti(searchQuery);
    setMovies(results);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen pt-8 pb-20 md:pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/**/}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 rounded-xl border border-red-600/30">
            <Film className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Каталог</h1>
            <p className="text-gray-400 mt-1">Знайдіть будь-який фільм або серіал у світі</p>
          </div>
        </div>

        {/**/}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Назва фільму чи серіалу..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white px-5 py-3.5 rounded-full pl-12 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-red-700 transition"
          >
            Шукати
          </button>
        </form>
      </div>

      {/**/}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie: any) => (
            <div key={movie.id} className="relative group">
              <MovieCard
                id={movie.id}
                title={movie.title || movie.name || "Без назви"}
                year={(movie.release_date || movie.first_air_date) ? String(movie.release_date || movie.first_air_date).substring(0, 4) : "N/A"}
                rating={Number(movie.vote_average) || 0}
                posterPath={movie.poster_path || ""}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 text-lg">
          За вашим запитом нічого не знайдено. Спробуйте змінити назву.
        </div>
      )}

    </main>
  );
}