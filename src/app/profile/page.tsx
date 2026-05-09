"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { useAuth } from "@/hooks/useAuth";
import { getMovieDetails } from "@/services/tmdb";
import MovieCard from "@/components/movies/MovieCard";
import { Film, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { likedMovies } = usePreferences();
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Якщо користувач ще не завантажився або немає лайків
    if (authLoading) return;
    
    if (!user || likedMovies.length === 0) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    // Завантажуємо деталі для кожного ID з Firebase
    const fetchLikedMovies = async () => {
      setIsLoading(true);
      try {
        const promises = likedMovies.map(id => getMovieDetails(id));
        const results = await Promise.all(promises);
        setMovies(results.filter(movie => movie !== null));
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedMovies();
  }, [likedMovies, user, authLoading]);

 //стани:

  // Завантаження
  if (authLoading || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  //Користувач не авторизований
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-16 h-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Увійдіть в акаунт</h1>
        <p className="text-gray-400">Щоб переглядати збережені фільми, потрібно авторизуватись.</p>
      </div>
    );
  }

  //Авторизований, але порожньо
  if (movies.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-16 h-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Тут поки порожньо</h1>
        <p className="text-gray-400">Ви ще не вподобали жодного фільму. Час це виправити!</p>
      </div>
    );
  }

  //Є збережені фільми
  return (
    <main className="min-h-screen pt-8 pb-20 md:pb-8 max-w-[1400px] mx-auto px-4 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Моя колекція
        </h1>
        <p className="text-gray-400">
          Фільми, які ви залишили на вечір ({movies.length})
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <MovieCard
              id={movie.id}
              title={movie.title || movie.name}
              year={movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
              rating={movie.vote_average || 0}
              posterPath={movie.poster_path}
            />
          </div>
        ))}
      </div>
    </main>
  );
}