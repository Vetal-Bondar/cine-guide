"use client";

import Link from "next/link";
import { Search, UserCircle, LogOut, Menu, X, Home, Film, Heart, Info, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { searchMulti } from "@/services/tmdb"; 
import MovieModal from "@/components/movies/MovieModal"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  //ЛОГІКА ЖИВОГО ПОШУКУ
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchMulti(searchQuery);
      setSearchResults(results.slice(0, 5)); 
      setIsSearching(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { name: "Головна", href: "/", icon: Home },
    { name: "Каталог", href: "/movies", icon: Film },
    { name: "Моя колекція", href: "/profile", icon: Heart },
    { name: "Про сервіс", href: "/about", icon: Info },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "bg-[#141414]/90 backdrop-blur-md shadow-md border-b border-zinc-800" : "bg-gradient-to-b from-black/90 to-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center gap-8 md:gap-12">
              <Link href="/" className="text-3xl font-extrabold text-red-600 tracking-tighter hover:text-red-500 transition">
                CINEGUIDE
              </Link>
              
              <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`relative py-1 transition-colors duration-300 hover:text-white flex items-center gap-1.5 group ${pathname === link.href ? "text-white font-bold" : ""}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)] transition-all duration-300 ${pathname === link.href ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"}`}></span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 md:gap-5">
              
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-3 py-2 w-[150px] sm:w-[220px] md:w-[300px] transition-all duration-300">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Фільм чи серіал..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-white w-full ml-2 placeholder:text-zinc-500"
                    />
                    <button 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                      className="text-gray-400 hover:text-white shrink-0 ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-300 hover:text-white transition p-2 bg-zinc-900/50 rounded-full hover:bg-zinc-800"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}

                <AnimatePresence>
                  {isSearchOpen && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-3 w-[280px] md:w-[350px] bg-[#141414] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[70]"
                    >
                      {isSearching ? (
                        <div className="flex justify-center p-6">
                          <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="flex flex-col">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setSelectedMovieId(item.id); 
                                setIsSearchOpen(false); 
                                setSearchQuery(""); 
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-zinc-900 transition text-left"
                            >
                              <img
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : "https://via.placeholder.com/92x138?text=No+Poster"}
                                alt={item.title || item.name}
                                className="w-10 h-14 object-cover rounded shrink-0"
                              />
                              <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-bold text-white truncate">{item.title || item.name}</span>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                  <span>{(item.release_date || item.first_air_date)?.substring(0, 4) || "N/A"}</span>
                                  <span className="text-yellow-500">★ {Number(item.vote_average || 0).toFixed(1)}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                         
                          <button
                            onClick={() => { 
                              setIsSearchOpen(false); 
                              setSearchQuery(""); 
                              router.push('/movies'); 
                            }}
                            className="w-full p-3 text-center text-sm text-red-500 hover:bg-zinc-900 transition font-bold border-t border-zinc-800"
                          >
                            Більше результатів у Каталозі
                          </button>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-sm text-gray-400">
                          Нічого не знайдено. Спробуйте іншу назву.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/profile">
                    <img src={user.photoURL || ""} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-transparent hover:border-red-600 transition-all object-cover" referrerPolicy="no-referrer" />
                  </Link>
                  <button onClick={() => signOut(auth)} className="p-2 bg-zinc-900/50 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition" title="Вийти">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                  <UserCircle className="w-5 h-5" /> Увійти
                </Link>
              )}

              <button 
                className="md:hidden text-gray-300 hover:text-white transition p-1"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-8 h-8" />
              </button>
            </div>

          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#141414] border-l border-zinc-800 z-[70] p-6 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-extrabold text-white tracking-tighter">Меню</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-900 rounded-full text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-4 mb-8 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <img src={user.photoURL || ""} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-red-600 object-cover" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold line-clamp-1">{user.displayName}</span>
                    <button onClick={() => { signOut(auth); setIsMobileMenuOpen(false); }} className="text-sm text-zinc-500 text-left hover:text-red-500 transition">
                      Вийти з акаунту
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center gap-2 bg-white text-black px-4 py-4 rounded-xl font-bold mb-8 active:scale-95 transition">
                  <UserCircle className="w-6 h-6" /> Увійти в акаунт
                </Link>
              )}

              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-red-600/20 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-4 py-4 rounded-xl font-bold mb-8 transition group shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" /> AI Підбір фільму
              </Link>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className={`flex items-center gap-4 text-lg font-medium p-4 rounded-xl transition ${
                        isActive ? "bg-zinc-800 text-white" : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? "text-red-500" : ""}`} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {selectedMovieId && (
        <MovieModal 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)} 
        />
      )}
    </>
  );
}