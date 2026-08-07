import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { backdropUrl } from "@/lib/tmdb";
import { useNavigate } from "react-router-dom";

export default function Hero({ items }) {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!items?.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % Math.min(items.length, 5)), 8000);
    return () => clearInterval(t);
  }, [items]);

  if (!items?.length) {
    return (
      <div className="w-full h-[70vh] bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-white animate-spin" />
      </div>
    );
  }

  const item = items[idx];
  const title = item.title || item.name;
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "85vh", minHeight: "500px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {item.backdrop_path ? (
            <img src={backdropUrl(item.backdrop_path)} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full bg-neutral-900" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-16 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-neutral-500 text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Featured
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[1.05] tracking-tight uppercase">
              {title}
            </h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8 line-clamp-2 max-w-xl">
              {item.overview}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/${mediaType}/${item.id}`)}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-black font-bold text-base uppercase tracking-wide hover:bg-neutral-300 active:scale-95 transition-all duration-300"
              >
                <Play size={20} fill="currentColor" />
                Watch Now
              </button>
              <button
                onClick={() => navigate(`/${mediaType}/${item.id}`)}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-transparent text-white border-2 border-neutral-700 font-bold text-base uppercase tracking-wide hover:border-white active:scale-95 transition-all duration-300"
              >
                <Info size={20} />
                More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 right-6 md:right-10 flex gap-2">
        {Array.from({ length: Math.min(items.length, 5) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 transition-all duration-300 ${
              i === idx ? "w-8 bg-white" : "w-2 bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}