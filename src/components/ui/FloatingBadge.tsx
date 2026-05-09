"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function FloatingBadge() {
  const { user } = useAuth();
  const { likedMovies } = usePreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user || likedMovies.length === 0) return null;

  return (
    <Link 
      href="/profile" 
      className="fixed bottom-6 right-6 z-50 group flex flex-col items-end"
    >
      <div className="mb-2 px-3 py-1.5 bg-red-950/80 border border-red-500/30 text-red-200 text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-md">
        Вас чекає {likedMovies.length} фільмів
      </div>
      
      <div className="relative bg-[#141414]/80 backdrop-blur-md border border-red-600/50 p-4 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] hover:bg-red-950/40 hover:border-red-500 transition-all duration-300">
        <Bookmark className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
        
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-extrabold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#141414] shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse">
          {likedMovies.length}
        </span>
      </div>
    </Link>
  );
}