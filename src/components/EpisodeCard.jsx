import React from "react";
import { Play, Clock } from "lucide-react";
import { stillUrl } from "@/lib/tmdb";

export default function EpisodeCard({ episode, index, onPlay }) {
  const still = stillUrl(episode.still_path);
  const runtime = episode.runtime ? `${episode.runtime}m` : "";

  return (
    <div className="flex flex-col md:flex-row gap-4 p-3 md:p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors duration-300 group">
      <div className="relative w-full md:w-64 aspect-video overflow-hidden bg-neutral-800 flex-shrink-0">
        {still ? (
          <img src={still} alt={episode.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={24} className="text-neutral-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button
            onClick={onPlay}
            className="w-12 h-12 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Play size={20} fill="currentColor" className="text-black ml-0.5" />
          </button>
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white text-black text-xs font-bold uppercase">
          E{episode.episode_number}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-lg font-bold text-white leading-tight">
            {episode.name || `Episode ${episode.episode_number}`}
          </h3>
          <button
            onClick={onPlay}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold uppercase tracking-wide hover:bg-neutral-300 active:scale-95 transition-all flex-shrink-0"
          >
            <Play size={16} fill="currentColor" />
            Play
          </button>
        </div>
        <div className="flex items-center gap-3 text-neutral-500 text-sm mb-2">
          <span className="font-bold">Episode {episode.episode_number}</span>
          {runtime && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {runtime}
            </span>
          )}
        </div>
        {episode.overview && (
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">{episode.overview}</p>
        )}
        <button
          onClick={onPlay}
          className="md:hidden mt-3 flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold uppercase self-start"
        >
          <Play size={16} fill="currentColor" />
          Play
        </button>
      </div>
    </div>
  );
}