import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101010] border-t border-zinc-900 pt-12 pb-24 md:pb-12 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Лого та 6 речень */}
        <div className="max-w-2xl text-center md:text-left">
          <Link href="/" className="flex items-center justify-center md:justify-start gap-2 text-2xl font-extrabold text-red-600 tracking-tighter mb-4">
            <Film className="w-8 h-8" />
            CINEGUIDE
          </Link>
          <div className="text-zinc-500 text-sm leading-relaxed space-y-2">
            <p>CineGuide — це сучасна вебплатформа для інтелектуального підбору відеоконтенту. Наш сервіс покликаний вирішити проблему тривалого пошуку фільмів для вечірнього перегляду.</p>
            <p>Ми використовуємо передову гібридну модель персоналізації даних користувача. Алгоритм одночасно аналізує ваш поточний настрій та спирається на історію ваших вподобань.</p>
            <p>Платформа інтегрована з глобальною базою TMDB для надання найактуальнішої інформації. Усі трейлери та описи оптимізовані для швидкого перегляду без перезавантаження сторінок.</p>
          </div>
        </div>

        {/* Копірайт */}
        <div className="text-zinc-600 text-sm font-medium">
          &copy; {new Date().getFullYear()} CineGuide. Всі права захищено.
        </div>
      </div>
    </footer>
  );
}