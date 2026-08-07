import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Star, Calendar, ArrowLeft, ChevronDown, User } from "lucide-react";
import { tmdb, posterUrl, backdropUrl, profileUrl } from "@/lib/tmdb";
import MoreLikeThis from "@/components/MoreLikeThis";
import EpisodeCard from "@/components/EpisodeCard";
import RatingBadge from "@/components/RatingBadge";
import { useImageColors } from "@/hooks/useImageColors";

export default function TVDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [season, setSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [episode, setEpisode] = useState(1);
  const [embedSrc, setEmbedSrc] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setDetails(null);
    setPlaying(false);
    setShowTrailer(false);
    tmdb.tvDetails(id).then(setDetails);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (details) {
      setSeasonData(null);
      tmdb.tvSeason(id, season).then(setSeasonData);
    }
  }, [id, details, season]);

  const backdropSrc = details?.backdrop_path ? backdropUrl(details.backdrop_path) : null;
  const colors = useImageColors(backdropSrc);

  if (!details) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-white animate-spin" />
      </div>
    );
  }

  const title = details.name || details.title;
  const year = (details.first_air_date || "").slice(0, 4);
  const numSeasons = details.number_of_seasons || 1;
  const rating = details.vote_average?.toFixed(1);
  const genres = details.genres?.map((g) => g.name).join(", ") || "";
  const cast = details.credits?.cast?.slice(0, 6) || [];
  const similar = details.similar?.results?.filter((s) => s.poster_path).slice(0, 10) || [];
  const trailer = details.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const usRating = details.content_ratings?.results?.find((r) => r.iso_3166_1 === "US")?.rating;
  const bgStyle = colors?.vibrant
    ? { background: `linear-gradient(180deg, rgba(${colors.vibrant.r},${colors.vibrant.g},${colors.vibrant.b},0.35) 0%, rgba(${colors.vibrant.r},${colors.vibrant.g},${colors.vibrant.b},0.08) 40%, #000 70%)` }
    : {};
  const episodes = seasonData?.episodes || [];

  const handlePlay = (ep) => {
    setEpisode(ep);
    setEmbedSrc(`https://vidsrc.to/embed/tv/${id}/${season}/${ep}`);
    setPlaying(true);
  };

  if (playing) {
    return (
      <div className="fixed inset-0 z-[60] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <button onClick={() => setPlaying(false)} className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-bold uppercase tracking-wide">Back</span>
          </button>
          <span className="text-white font-bold truncate ml-4 uppercase tracking-wide">
            {title} · S{season}:E{episode}
          </span>
        </div>
        <div className="flex-1">
          <iframe src={embedSrc} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" title={title} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={bgStyle}>
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {details.backdrop_path ? (
          <img src={backdropUrl(details.backdrop_path)} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 md:left-10 w-10 h-10 bg-black/80 backdrop-blur flex items-center justify-center text-white hover:bg-black transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-2/5">
            <div className="md:sticky md:top-24">
              {details.poster_path && (
                <img src={posterUrl(details.poster_path, "w500")} alt={title} className="w-full max-w-xs shadow-2xl mx-auto md:mx-0" />
              )}
              <div className="mt-6 space-y-3 max-w-xs mx-auto md:mx-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">{title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-neutral-500 text-sm">
                  {year && <span className="flex items-center gap-1.5"><Calendar size={14} /> {year}</span>}
                  {rating && (
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="text-white" fill="currentColor" /> {rating}
                    </span>
                  )}
                  <span>{numSeasons} Season{numSeasons > 1 ? "s" : ""}</span>
                </div>
                {genres && <p className="text-neutral-400 text-sm uppercase tracking-wide">{genres}</p>}
                {usRating && (
                  <div className="pt-1">
                    <RatingBadge rating={usRating} />
                  </div>
                )}
                {details.overview && (
                  <p className="text-neutral-400 text-sm leading-relaxed">{details.overview}</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-6">
                <div className="relative inline-block w-full sm:w-auto">
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="appearance-none w-full sm:w-auto pl-5 pr-12 py-3 bg-neutral-900 border-2 border-neutral-800 focus:border-white text-white font-bold uppercase tracking-wide cursor-pointer outline-none transition-colors"
                  >
                    {Array.from({ length: numSeasons }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>Season {s}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Episodes</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {episodes.length > 0
                    ? episodes.map((ep, i) => (
                        <EpisodeCard key={ep.id || i} episode={ep} index={i} onPlay={() => handlePlay(ep.episode_number)} />
                      ))
                    : Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 bg-neutral-900 animate-pulse" />
                      ))}
                </div>
              </div>

              {cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Cast</h3>
                  <div className="flex flex-wrap gap-4">
                    {cast.map((person) => (
                      <div key={person.id} className="flex flex-col items-center w-20">
                        {person.profile_path ? (
                          <img src={profileUrl(person.profile_path)} alt={person.name} className="w-20 h-20 object-cover mb-2" loading="lazy" />
                        ) : (
                          <div className="w-20 h-20 bg-neutral-900 flex items-center justify-center mb-2">
                            <User size={24} className="text-neutral-700" />
                          </div>
                        )}
                        <p className="text-xs font-bold text-white text-center leading-tight">{person.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trailer && (
                <div className="mb-8">
                  <button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="flex items-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-neutral-700 font-bold uppercase tracking-wide hover:border-white transition-all"
                  >
                    <Play size={18} fill="currentColor" /> {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                  </button>
                  {showTrailer && (
                    <div className="mt-4 aspect-video overflow-hidden bg-black">
                      <iframe src={`https://www.youtube.com/embed/${trailer.key}`} className="w-full h-full" allowFullScreen title="Trailer" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16 mb-12">
            <MoreLikeThis items={similar} onSelect={(item) => navigate(`/tv/${item.id}`)} />
          </div>
        )}
      </div>
    </div>
  );
}