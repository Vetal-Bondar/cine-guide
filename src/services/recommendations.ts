const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getHybridRecommendations = async (answers: any) => {
  // 1. Беремо конкретний жанр (настрій ігноруємо, це був психологічний гачок)
  const genres = answers.genre || "";

  // 2. Аналізуємо час
  let runtimeParams = "";
  switch (answers.duration) {
    case "short": runtimeParams = "&with_runtime.lte=90"; break;
    case "medium": runtimeParams = "&with_runtime.gte=90&with_runtime.lte=120"; break;
    case "long": runtimeParams = "&with_runtime.gte=120"; break;
  }

  // 3. Аналізуємо епоху
  let dateParams = "";
  switch (answers.era) {
    case "classic": dateParams = "&primary_release_date.lte=1999-12-31"; break;
    case "mid": dateParams = "&primary_release_date.gte=2000-01-01&primary_release_date.lte=2015-12-31"; break;
    case "modern": dateParams = "&primary_release_date.gte=2016-01-01"; break;
  }

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=uk-UA&sort_by=popularity.desc&with_genres=${genres}${runtimeParams}${dateParams}&page=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Помилка алгоритму рекомендацій");
    const data = await res.json();
    return data.results.slice(0, 9); // Повертаємо Топ-3
  } catch (error) {
    console.error(error);
    return [];
  }
};