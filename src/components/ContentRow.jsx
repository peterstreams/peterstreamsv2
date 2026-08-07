import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";

export default function ContentRow({ title, fetchFn, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchFn()
      .then((data) => setItems(data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchFn]);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <div className="mb-12 group/row">
      <div className="flex items-center justify-between px-4 md:px-10 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 border border-neutral-700 bg-black flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 border border-neutral-700 bg-black flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-10 pb-2">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 md:w-44">
                <div className="aspect-[2/3] bg-neutral-900 animate-pulse" />
              </div>
            ))
          : items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-32 md:w-44">
                <MediaCard item={item} onClick={onSelect} />
              </div>
            ))}
      </div>
    </div>
  );
}