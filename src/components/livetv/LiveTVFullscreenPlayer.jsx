import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export default function LiveTVFullscreenPlayer({ channel, onClose }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, [channel?.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!channel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black flex flex-col"
    >
      <div className="flex-1 relative bg-black overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
            <Loader2 size={36} className="text-white animate-spin" />
            <p className="text-white/60 text-sm">Loading {channel.name}...</p>
          </div>
        )}
        <iframe
          src={channel.playerUrl}
          title={channel.name}
          className="w-full h-full"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 bg-black/70 hover:bg-black/90 text-white transition-all backdrop-blur-sm"
        title="Exit (Esc)"
      >
        <X size={16} />
      </button>

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-xs font-semibold uppercase tracking-wider truncate max-w-[160px]">
          {channel.name}
        </span>
      </div>
    </motion.div>
  );
}