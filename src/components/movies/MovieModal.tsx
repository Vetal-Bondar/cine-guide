"use client";

import { useEffect, useState } from "react";
import { X, Heart, Clock, PlayCircle } from "lucide-react";
import { getMovieDetails, getMovieTrailer } from "@/services/tmdb";
import { usePreferences } from "@/hooks/usePreferences";

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
}

export default function MovieModal({ movieId, onClose }: MovieModalProps) {
  const { likedMovies, toggleLike } = usePreferences();
  const isLiked = likedMovies.includes(movieId);
  const [details, setDetails] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [movieData, videoKey] = await Promise.all([
        getMovieDetails(movieId),
        getMovieTrailer(movieId)
      ]);
      setDetails(movieData);
      setTrailerKey(videoKey);
      setLoading(false);
    };
    fetchData();
  }, [movieId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-zinc-900/50 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-5xl bg-[#141414] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col md:flex-row max-h-[90vh]">
        
        <div className="w-full md:w-2/3 bg-black aspect-video relative flex items-center justify-center">
          {loading ? (
            <div className="animate-pulse text-zinc-600">Завантаження...</div>
          ) : trailerKey ? (
            <iframe 
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=uk`} 
              className="w-full h-full"
              allow="autoplay; encrypted-media" 
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full relative">
              <img 
                src={`https://image.tmdb.org/t/p/w780${details?.backdrop_path || details?.poster_path}`} 
                className="w-full h-full object-cover opacity-50"
                alt="Backdrop"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <PlayCircle className="w-16 h-16 text-zinc-600 mb-2" />
                <p className="text-zinc-400">Трейлер тимчасово недоступний</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col overflow-y-auto">
          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
              <div className="h-24 bg-zinc-800 rounded w-full mt-4"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{details?.title}</h2>
              
              <div className="flex gap-3 text-sm text-gray-400 mb-6 font-medium">
                <span>{details?.release_date?.substring(0, 4)}</span>
                <span>•</span>
                <span className="text-yellow-500">★ {details?.vote_average?.toFixed(1)}</span>
                <span>•</span>
                <span>{details?.runtime} хв</span>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 flex-grow">
                {details?.overview || "Опис українською мовою наразі відсутній."}
              </p>

              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={() => toggleLike(movieId)}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 font-bold rounded-xl transition active:scale-95 shadow-lg ${
                    isLiked 
                      ? "bg-white text-black hover:bg-gray-200" 
                      : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                  {isLiked ? "Збережено в колекцію" : "Вподобати (Лайк)"}
                </button>
                
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(details?.title + ' дивитися онлайн українською')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  <PlayCircle className="w-5 h-5" />
                  Дивитися фільм
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}