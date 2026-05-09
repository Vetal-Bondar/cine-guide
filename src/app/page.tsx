"use client";

import { useState } from "react";
import MovieCard from "../components/movies/MovieCard";
import MovieRow from "../components/MovieRow";
import RecommendationWizard from "../components/ui/RecommendationWizard";
import PersonalizedRow from "../components/movies/PersonalizedRow";
import { useEffect } from "react";
import { getTrendingMovies } from "../services/tmdb";

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  // Завантажуємо фільми при старті
  useEffect(() => {
    getTrendingMovies().then(data => setMovies(data));
  }, []);

  return (
    <main className="min-h-screen pb-20 md:pb-8 overflow-hidden">
      
{}
      <section className="relative py-8 md:py-10 flex items-center justify-center text-center px-4 mb-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-[#141414] to-[#141414] z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight flex flex-col md:flex-row md:gap-3 items-center">
            <span>Твій ідеальний вечір</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">починається тут</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 mb-5 max-w-2xl">
            Ми вивчимо ваші смаки за 30 секунд і підберемо ідеальне кіно.
          </p>
          
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="px-8 py-3 bg-red-600 text-white font-bold text-sm md:text-base rounded-full hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300"
          >
            Підібрати фільм
          </button>
        </div>
      </section>

      
      <div className="max-w-[1400px] mx-auto">

{/*Гібридна персоналізована стрічка*/}
        <PersonalizedRow />

        {movies.length > 0 && (
          <MovieRow title="Популярне зараз" subtitle="Фільми, які дивляться у всьому світі">
            {movies.map((movie: any) => (
              <div key={movie.id} className="min-w-[70px] md:min-w-[120px] flex-shrink-0 snap-start">
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
        )}
      </div>
      {isWizardOpen && (
        <RecommendationWizard onClose={() => setIsWizardOpen(false)} />
      )}

    </main>
  );


}