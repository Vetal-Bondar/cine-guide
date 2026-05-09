"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Викликаємо вікно авторизації Google
      await signInWithPopup(auth, provider);
      // Якщо все успішно — перекидаємо на головну сторінку
      router.push("/"); 
    } catch (error) {
      console.error("Помилка авторизації:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 md:p-10 rounded-3xl shadow-2xl text-center">
        
        {/**/}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-red-600/20">
            <Film className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
          CINEGUIDE
        </h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
          Увійдіть, щоб зберігати вподобані фільми, проходити тестування настрою та отримувати персональні гібридні рекомендації.
        </p>
        
        {/**/}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Продовжити з Google
        </button>

        <p className="mt-6 text-xs text-zinc-600">
          Натискаючи кнопку, ви погоджуєтесь з тим, що платформа зчитуватиме ваші кіно-вподобання.
        </p>
      </div>
    </div>
  );
}