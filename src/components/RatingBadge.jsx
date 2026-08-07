import React from "react";

export default function RatingBadge({ rating }) {
  if (!rating || rating === "NR" || rating === "" || rating === "Not Rated") return null;

  return (
    <div className="inline-flex items-center gap-2">
      <div className="bg-black text-white px-2.5 py-1 font-bold text-xs tracking-widest border border-white/30 uppercase">
        {rating}
      </div>
      <span className="text-neutral-500 text-xs uppercase tracking-wider">
        {rating.startsWith("TV-") ? "TV Rating" : "Rated"}
      </span>
    </div>
  );
}