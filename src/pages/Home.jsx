import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { tmdb } from "@/lib/tmdb";
import LandingPage from "./LandingPage";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    tmdb.trendingAll(1).then((d) =>
      setHeroItems((d.results || []).filter((i) => i.backdrop_path).slice(0, 5))
    );
  }, []);

  if (!entered) {
    return <LandingPage onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="bg-black min-h-screen">
      <Hero items={heroItems} />
      <div className="-mt-16 relative z-10 pb-12">
        <ContentRow title="Trending Now" fetchFn={() => tmdb.trendingAll(1)} />
        <ContentRow title="Popular Movies" fetchFn={() => tmdb.popularMovies(1)} />
        <ContentRow title="Popular TV Shows" fetchFn={() => tmdb.popularTV(1)} />
        <ContentRow
          title="Recently Added"
          fetchFn={() =>
            tmdb.discoverMovies({
              sort_by: "release_date.desc",
              "primary_release_date.lte": new Date().toISOString().slice(0, 10),
            })
          }
        />
      </div>
    </div>
  );
}