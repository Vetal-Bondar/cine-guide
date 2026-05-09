const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingMovies = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=uk-UA`
    );
    if (!res.ok) throw new Error("Помилка завантаження фільмів");
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};
// ... попередній код залишається ...

// Отримуємо повні деталі фільму
export const getMovieDetails = async (movieId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=uk-UA`
    );
    if (!res.ok) throw new Error("Помилка завантаження деталей");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Шукаємо офіційний трейлер на YouTube
export const getMovieTrailer = async (movieId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const data = await res.json();
    
    // Шукаємо саме трейлер на YouTube
    const trailer = data.results?.find(
      (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
    );
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
// Отримуємо гібридні рекомендації на основі конкретного фільму
export const getSimilarMovies = async (movieId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=uk-UA`
    );
    if (!res.ok) throw new Error("Помилка завантаження схожих фільмів");
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Пошук фільмів за текстовим запитом
export const searchMovies = async (query: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=uk-UA&query=${encodeURIComponent(query)}&page=1`
    );
    if (!res.ok) throw new Error("Помилка пошуку");
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Пошук фільмів ТА серіалів (Мульти-пошук)
export const searchMulti = async (query: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=uk-UA&query=${encodeURIComponent(query)}&page=1`
    );
    if (!res.ok) throw new Error("Помилка пошуку");
    const data = await res.json();
    
    // Фільтруємо: залишаємо тільки фільми (movie) та серіали (tv)
    return data.results.filter((item: any) => item.media_type === "movie" || item.media_type === "tv");
  } catch (error) {
    console.error(error);
    return [];
  }
};