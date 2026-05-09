"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import MovieModal from "./MovieModal";

interface MovieCardProps {
  id?: number; 
  title: string;
  year: string;
  rating: number;
  posterPath?: string; 
}

export default function MovieCard({ id, title, year, rating, posterPath }: MovieCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden rounded-xl bg-zinc-900 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 cursor-pointer flex flex-col h-full"
      >
        <div className="aspect-[2/3] w-full bg-zinc-800 relative border border-zinc-800 rounded-t-xl overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition transform scale-75 group-hover:scale-100 shadow-lg">
              <Play fill="currentColor" className="w-6 h-6 ml-1" />
            </button>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-bold text-base md:text-lg line-clamp-1 text-white" title={title}>{title}</h3>
          <div className="flex items-center justify-between mt-2 text-sх text-gray-400">
            <span>{year}</span>
            <span className="flex items-center gap-1 text-yellow-500 font-medium">★ {Number(rating).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {isModalOpen && id && (
        <MovieModal movieId={id} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}