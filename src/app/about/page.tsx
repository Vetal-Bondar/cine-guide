import { Code2, Cpu, Database, Layout } from "lucide-react";

export const metadata = {
  title: "Про сервіс | CINEGUIDE",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-12 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Архітектура <span className="text-red-600">CineGuide</span>
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Ця платформа створена в рамках дипломного проєкту на тему: <br/>
          <span className="text-white font-medium italic mt-2 block">
            «Розробка веб-платформи рекомендації відеоконтенту з використанням гібридних моделей персоналізації на базі фреймворку Next.js»
          </span>
        </p>
      </div>

      <div className="space-y-8">
        
        <div className="bg-[#141414] border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-600/20 transition-all duration-500"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-950/50 text-red-500 rounded-xl border border-red-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Гібридна модель персоналізації</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Система відходить від класичного фільтрування за одним параметром. Алгоритм поєднує колаборативну фільтрацію (історія вподобань) та контентну (аналіз поточного емоційного стану та наявного часу користувача). Це дозволяє генерувати високоточні рекомендації в режимі реального часу.
          </p>
        </div>

        <div className="bg-[#141414] border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all duration-500"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-950/50 text-blue-500 rounded-xl border border-blue-500/20">
              <Layout className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Технологічний стек Next.js</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Проєкт побудований на сучасному фреймворку Next.js з використанням серверного рендерингу (SSR) та статичної генерації (SSG). Це забезпечує максимальну швидкість завантаження контенту, оптимізацію для пошукових систем (SEO) та безшовний користувацький досвід без перезавантаження сторінок.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#141414] border border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-gray-300" />
              <h3 className="text-lg font-bold text-white">База Даних (Firebase)</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Безпечна авторизація через Google та хмарне зберігання NoSQL (Firestore) для швидкого доступу до колекцій користувачів.
            </p>
          </div>

          <div className="bg-[#141414] border border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-5 h-5 text-gray-300" />
              <h3 className="text-lg font-bold text-white">Зовнішні API (TMDB)</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Інтеграція з The Movie Database для отримання актуальних постерів, метаданих, рейтингів та офіційних трейлерів.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}