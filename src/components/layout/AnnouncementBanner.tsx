"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Flame, Megaphone } from "lucide-react";
import { DEFAULT_ANNOUNCEMENTS } from "@/types";

interface AnnouncementBannerProps {
  announcements?: string[];
}

export function AnnouncementBanner({ announcements = DEFAULT_ANNOUNCEMENTS }: AnnouncementBannerProps) {
  const list = announcements && announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (list.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % list.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [list.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#0b0d14] border-b border-white/[0.06] py-1.5 px-4 text-xs font-medium text-amber-300/90 relative overflow-hidden transition-colors"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left Arrow (if multiple) */}
        {list.length > 1 && (
          <button
            onClick={handlePrev}
            className="text-zinc-500 hover:text-amber-300 p-0.5 rounded hover:bg-white/[0.05] transition-colors"
            title="Anuncio anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center Rotating Text with smooth fade */}
        <div className="flex-1 text-center truncate px-2 flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <span 
            key={currentIndex} 
            className="animate-fadeIn truncate tracking-wide text-xs font-medium text-amber-200"
          >
            {list[currentIndex]}
          </span>
        </div>

        {/* Right Arrow & Count Dots */}
        {list.length > 1 && (
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
              {currentIndex + 1}/{list.length}
            </span>
            <button
              onClick={handleNext}
              className="text-zinc-500 hover:text-amber-300 p-0.5 rounded hover:bg-white/[0.05] transition-colors"
              title="Siguiente anuncio"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
