import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { posterUrl } from "@/lib/tmdb";

export default function MediaCard({ item, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const poster = posterUrl(item.poster_path);
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  const handleClick = () => {
    if (onClick) onClick(item);
    else navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div onClick={handleClick} className="group cursor-pointer flex flex-col">
      <div className="relative overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-all duration-500">
        <div className="aspect-[2/3] relative">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              } grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <span className="text-neutral-600 text-sm text-center font-bold uppercase">{title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
            <p className="text-white text-xs font-bold leading-tight line-clamp-2 uppercase tracking-wide">{title}</p>
          </div>
        </div>
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-white text-sm font-bold leading-tight truncate uppercase tracking-wide">{title}</p>
        {year && <p className="text-neutral-500 text-xs mt-0.5">{year}</p>}
      </div>
    </div>
  );
}