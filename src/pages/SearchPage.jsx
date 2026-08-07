import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, Film } from "lucide-react";
import { tmdb } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await tmdb.search(query);
      setResults((data.results || []).filter((r) => r.media_type !== "person" && r.poster_path));
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="bg-black min-h-screen pb-12 pt-8">
      <div className="px-4 md:px-10 max-w-5xl mx-auto">
        <div className="relative mb-10">
          <SearchIcon size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows..."
            className="w-full pl-14 pr-5 py-5 bg-neutral-900 border-2 border-neutral-800 focus:border-white text-xl text-white placeholder-neutral-600 outline-none transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-neutral-700 border-t-white animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="animate-fade-in">
            <p className="text-neutral-500 text-sm mb-5 uppercase tracking-wide">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {results.map((item) => (
                <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film size={48} className="text-neutral-700 mb-4" />
            <p className="text-neutral-500 text-lg">No results found for "{query}"</p>
            <p className="text-neutral-600 text-sm mt-1">Try searching for something else</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon size={48} className="text-neutral-700 mb-4" />
            <p className="text-neutral-500 text-lg">Search for your favorite movies and shows</p>
          </div>
        )}
      </div>
    </div>
  );
}