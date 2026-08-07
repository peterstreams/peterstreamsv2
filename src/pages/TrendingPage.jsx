import React from "react";
import ContentRow from "@/components/ContentRow";
import { tmdb } from "@/lib/tmdb";

export default function TrendingPage() {
  return (
    <div className="bg-black min-h-screen pb-12 pt-8">
      <div className="px-4 md:px-10 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 uppercase">Trending</h1>
        <p className="text-neutral-500">What everyone's watching this week</p>
      </div>
      <ContentRow title="Trending Today" fetchFn={() => tmdb.trendingAll(1)} />
      <ContentRow title="Trending Movies" fetchFn={() => tmdb.trending(1)} />
      <ContentRow title="Trending TV Shows" fetchFn={() => tmdb.trendingTV(1)} />
    </div>
  );
}