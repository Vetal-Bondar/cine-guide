"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { getSimilarMovies } from "@/services/tmdb";
import MovieRow from "../MovieRow";
import MovieCard from "./MovieCard";

export default function PersonalizedRow() {
  const { likedMovies } = usePreferences();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalized = async () => {
      // Якщо лайків ще немає - нічого не робимо
      if (!likedMovies || likedMovies.length === 0) {
        setLoading(false);
        return;
      }

      // Беремо останній лайкнутий фільм як базу для гібридної рекомендації
      const latestLikeId = likedMovies[likedMovies.length - 1];
      const similar = await getSimilarMovies(latestLikeId);
      
      setRecommended(similar);
      setLoading(false);
    };

    fetchPersonalized();
  }, [likedMovies]);

  if (loading || recommended.length === 0) return null;

  return (
    <div className="relative">
      {/* Неоновий акцент для преміального блоку */}
      <div className="absolute -top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>
      
      <MovieRow 
        title="Спеціально для вас" 
        subtitle="Гібридна підбірка на основі ваших останніх вподобань"
      >
        {recommended.map((movie: any) => (
          <div key={movie.id} className="min-w-[130px] md:min-w-[180px] flex-shrink-0 snap-start">
            <MovieCard
              id={movie.id}
              title={movie.title || movie.name || "Без назви"}
              year={movie.release_date ? String(movie.release_date).substring(0, 4) : "N/A"}
              rating={Number(movie.vote_average) || 0}
              posterPath={movie.poster_path || ""}
            />
          </div>
        ))}
      </MovieRow>
    </div>
  );
}