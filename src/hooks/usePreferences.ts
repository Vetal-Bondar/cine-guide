"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function usePreferences() {
  const { user } = useAuth();
  const [likedMovies, setLikedMovies] = useState<number[]>([]);

  // Завантажуємо лайки коли користувач заходить на сайт
  useEffect(() => {
    if (!user) {
      setLikedMovies([]);
      return;
    }

    const fetchLikes = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists() && docSnap.data().likedMovies) {
        setLikedMovies(docSnap.data().likedMovies);
      }
    };

    fetchLikes();
  }, [user]);

  // Функція для додавання/видалення лайку
  const toggleLike = async (movieId: number) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб зберігати фільми.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const isLiked = likedMovies.includes(movieId);

    // Оновлюємо локальний стан миттєво для швидкості інтерфейсу
    setLikedMovies(prev => 
      isLiked ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );

    // Відправляємо дані у Firebase
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // Якщо користувач лайкає вперше - створюємо йому документ
        await setDoc(userRef, { likedMovies: [movieId] });
      } else {
        // Якщо документ є - просто оновлюємо масив
        await updateDoc(userRef, {
          likedMovies: isLiked ? arrayRemove(movieId) : arrayUnion(movieId)
        });
      }
    } catch (error) {
      console.error("Помилка збереження в Firebase:", error);
      // Якщо сталася помилка - відкочуємо локальний стан назад
      setLikedMovies(prev => 
        isLiked ? [...prev, movieId] : prev.filter(id => id !== movieId)
      );
    }
  };

  return { likedMovies, toggleLike };
}