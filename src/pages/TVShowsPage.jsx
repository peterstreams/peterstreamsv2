import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { tmdb } from "@/lib/tmdb";

export default function TVShowsPage() {
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    tmdb.trendingTV(1).then((d) =>
      setHeroItems(
        (d.results || []).filter((i) => i.backdrop_path).slice(0, 5).map((i) => ({ ...i, media_type: "tv" }))
      )
    );
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Hero items={heroItems} />
      <div className="-mt-16 relative z-10 pb-12">
        <ContentRow title="Trending TV" fetchFn={() => tmdb.trendingTV(1)} />
        <ContentRow title="Popular Shows" fetchFn={() => tmdb.popularTV(1)} />
        <ContentRow title="Top Rated" fetchFn={() => tmdb.topRatedTV(1)} />
        <ContentRow title="Drama" fetchFn={() => tmdb.discoverTV({ with_genres: "18" })} />
        <ContentRow title="Sci-Fi & Fantasy" fetchFn={() => tmdb.discoverTV({ with_genres: "10765" })} />
        <ContentRow title="Action & Adventure" fetchFn={() => tmdb.discoverTV({ with_genres: "10759" })} />
        <ContentRow title="Comedy" fetchFn={() => tmdb.discoverTV({ with_genres: "35" })} />
        <ContentRow title="Animation" fetchFn={() => tmdb.discoverTV({ with_genres: "16" })} />
      </div>
    </div>
  );
}