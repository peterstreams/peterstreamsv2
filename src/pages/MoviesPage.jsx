import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { tmdb } from "@/lib/tmdb";

export default function MoviesPage() {
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    tmdb.trending(1).then((d) =>
      setHeroItems(
        (d.results || []).filter((i) => i.backdrop_path).slice(0, 5).map((i) => ({ ...i, media_type: "movie" }))
      )
    );
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Hero items={heroItems} />
      <div className="-mt-16 relative z-10 pb-12">
        <ContentRow title="Trending This Week" fetchFn={() => tmdb.trending(1)} />
        <ContentRow title="Popular Movies" fetchFn={() => tmdb.popularMovies(1)} />
        <ContentRow title="Top Rated" fetchFn={() => tmdb.topRatedMovies(1)} />
        <ContentRow title="Now Playing" fetchFn={() => tmdb.nowPlaying(1)} />
        <ContentRow title="Action & Adventure" fetchFn={() => tmdb.discoverMovies({ with_genres: "28" })} />
        <ContentRow title="Sci-Fi" fetchFn={() => tmdb.discoverMovies({ with_genres: "878" })} />
        <ContentRow title="Horror" fetchFn={() => tmdb.discoverMovies({ with_genres: "27" })} />
        <ContentRow title="Comedy" fetchFn={() => tmdb.discoverMovies({ with_genres: "35" })} />
        <ContentRow title="Drama" fetchFn={() => tmdb.discoverMovies({ with_genres: "18" })} />
      </div>
    </div>
  );
}