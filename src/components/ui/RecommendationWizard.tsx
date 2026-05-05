"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laugh, Brain, Zap, Coffee, Clock, Calendar, X, Loader2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { getHybridRecommendations } from "@/services/recommendations";
import MovieCard from "../movies/MovieCard";

const QUESTIONS = [
  {
    id: "mood",
    title: "Який настрій для перегляду?",
    type: "big",
    options: [
      { label: "Хочу посміятись", value: "comedy", icon: Laugh, bgClass: "bg-yellow-500/20", textClass: "text-yellow-500" },
      { label: "Хочу подумати", value: "drama", icon: Brain, bgClass: "bg-blue-500/20", textClass: "text-blue-500" },
      { label: "Потрібен адреналін", value: "action", icon: Zap, bgClass: "bg-red-500/20", textClass: "text-red-500" },
      { label: "Чисто розслабитись", value: "chill", icon: Coffee, bgClass: "bg-green-500/20", textClass: "text-green-500" },
    ]
  },
  {
    id: "genre",
    title: "Оберіть бажаний жанр",
    type: "pills",
    options: [
      { label: "Бойовик", value: "28" }, { label: "Пригоди", value: "12" },
      { label: "Мультфільм", value: "16" }, { label: "Комедія", value: "35" },
      { label: "Кримінал", value: "80" }, { label: "Документальний", value: "99" },
      { label: "Драма", value: "18" }, { label: "Сімейний", value: "10751" },
      { label: "Фентезі", value: "14" }, { label: "Історія", value: "36" },
      { label: "Жахи", value: "27" }, { label: "Музика", value: "10402" },
      { label: "Детектив", value: "9648" }, { label: "Мелодрама", value: "10749" },
      { label: "Фантастика", value: "878" }, { label: "Телефільм", value: "10770" },
      { label: "Трилер", value: "53" }, { label: "Військовий", value: "10752" },
      { label: "Вестерн", value: "37" }
    ]
  },
  {
    id: "duration",
    title: "Оберіть тривалість фільму",
    type: "big",
    options: [
      { label: "До 90 хв", value: "short", icon: Clock, bgClass: "bg-green-500/20", textClass: "text-green-500" },
      { label: "90 - 120 хв", value: "medium", icon: Clock, bgClass: "bg-yellow-500/20", textClass: "text-yellow-500" },
      { label: "Понад 120 хв", value: "long", icon: Clock, bgClass: "bg-red-500/20", textClass: "text-red-500" },
    ]
  },
  {
    id: "era",
    title: "Який період випуску?",
    type: "big",
    options: [
      { label: "Класика (до 2000)", value: "classic", icon: Calendar, bgClass: "bg-purple-500/20", textClass: "text-purple-500" },
      { label: "Перевірене (2000-2015)", value: "mid", icon: Calendar, bgClass: "bg-blue-500/20", textClass: "text-blue-500" },
      { label: "Сучасне (2015+)", value: "modern", icon: Calendar, bgClass: "bg-cyan-500/20", textClass: "text-cyan-500" },
    ]
  }
];

export default function RecommendationWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = async (value: string) => {
    const currentQuestion = QUESTIONS[step];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFetching(true);
      const recommendedMovies = await getHybridRecommendations(newAnswers);
      setResults(recommendedMovies);
      setIsFetching(false);
    }
  };

  const resetWizard = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector<HTMLDivElement>('div[className*="snap-center"]')?.offsetWidth || 80;
      const scrollAmount = cardWidth + 12;
      const scrollOffset = direction === "left" ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-white transition z-50">
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-6xl relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {isFetching && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-4" />
              <p className="text-white text-lg font-medium">Штучний інтелект аналізує базу...</p>
            </motion.div>
          )}

          {!isFetching && results && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full flex flex-col items-center py-10 relative"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                Ваша персональна <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">Підбірка</span>
              </h2>
              
              {/* Карусель з обробником коліщатка */}
              <div 
                ref={scrollRef}
                onWheel={(e) => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="w-full flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 pb-12 relative"
              >
                {results.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
                    className="min-w-[200px] w-[200px] md:min-w-[280px] md:w-[280px] flex-shrink-0 snap-center relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative h-full">
                      <MovieCard
                        id={movie.id}
                        title={movie.title || movie.name}
                        year={movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
                        rating={movie.vote_average || 0}
                        posterPath={movie.poster_path}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Змінили left-2 на -left-[50px] */}
              <button 
                onClick={() => handleScroll("left")}
                className="absolute -left-[70px] top-1/2 -translate-y-1/2 p-3 bg-red-950/40 border border-red-500/50 text-red-500 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all duration-300 z-10 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 animate-pulse" />
              </button>
              
              {/* Змінили right-2 на -right-[50px] */}
              <button 
                onClick={() => handleScroll("right")}
                className="absolute -right-[70px] top-1/2 -translate-y-1/2 p-3 bg-red-950/40 border border-red-500/50 text-red-500 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all duration-300 z-10 active:scale-95"
              >
                <ChevronRight className="w-6 h-6 animate-pulse" />
              </button>

              <button 
                onClick={resetWizard} 
                className="flex items-center gap-2 px-8 py-3 bg-zinc-800/80 backdrop-blur-md text-white font-bold rounded-full border border-zinc-700 hover:bg-zinc-700 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" /> Підібрати заново
              </button>
            </motion.div>
          )}

          {!isFetching && !results && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl flex flex-col items-center px-4 py-12"
            >
              <span className="text-red-600 font-bold tracking-widest text-sm mb-4 uppercase">
                Крок {step + 1} із {QUESTIONS.length}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center">
                {QUESTIONS[step].title}
              </h2>

              {QUESTIONS[step].type === "big" && (
                <div className={`grid grid-cols-1 ${QUESTIONS[step].options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 w-full`}>
                  {QUESTIONS[step].options.map((opt: any) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className="flex flex-col items-center justify-center gap-4 py-8 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-200 group"
                      >
                        <div className={`p-4 rounded-full ${opt.bgClass} transition`}>
                          <Icon className={`w-10 h-10 ${opt.textClass}`} />
                        </div>
                        <span className="text-white font-bold text-base md:text-lg text-center leading-snug">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {QUESTIONS[step].type === "pills" && (
                <div className="flex flex-wrap justify-center gap-3 w-full max-h-[50vh] overflow-y-auto no-scrollbar pb-4 px-2">
                  {QUESTIONS[step].options.map((opt: any) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="px-5 py-3 rounded-full bg-zinc-900 border border-zinc-700 text-gray-300 font-medium hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-200 text-xs md:text-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}