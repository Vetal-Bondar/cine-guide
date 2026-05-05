"use client";

import { useRef } from "react";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function MovieRow({ title, subtitle, children }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (rowRef.current) {
      e.preventDefault();
      rowRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="mb-12 relative group">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 px-4 md:px-0">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm md:text-base mb-4 px-4 md:px-0">{subtitle}</p>}
      <div 
        ref={rowRef}
        onWheel={handleWheel}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-4 scroll-smooth"
      >
        {children}
      </div>
    </section>
  );
}