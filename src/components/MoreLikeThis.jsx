import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";

export default function MoreLikeThis({ items, onSelect }) {
  const scrollRef = useRef(null);
  if (!items?.length) return null;

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 500, behavior: "smooth" });

  return (
    <div className="group/row">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase">More Like This</h2>
        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-32 md:w-40">
            <MediaCard item={item} onClick={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}