import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import { getChannelLogo } from "@/data/channelLogos";

export default function ChannelCard({ channel, onClick }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getChannelLogo(channel.name) || channel.image;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(channel)}
      className="flex flex-col bg-black border border-neutral-800 hover:border-neutral-600 transition-all group overflow-hidden"
    >
      {/* Logo area — white background as requested */}
      <div className="relative w-full aspect-video bg-neutral-200 overflow-hidden flex items-center justify-center">
        {!imgError && logoUrl ? (
          <img
            src={logoUrl}
            alt={channel.name}
            className="w-full h-full object-contain transition-all p-3"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <Tv size={28} className="text-neutral-400" />
        )}
        {channel.status === "online" && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[9px] font-bold uppercase tracking-wider">LIVE</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 text-left">
        <p className="text-white group-hover:text-neutral-300 text-sm font-bold leading-tight line-clamp-2 transition-colors uppercase tracking-wide">
          {channel.name}
        </p>
      </div>
    </motion.button>
  );
}