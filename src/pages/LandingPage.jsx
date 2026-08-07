import React, { useState } from "react";
import { motion } from "framer-motion";

const GIFS = [
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/6444e1e00_bad-dustin-poirier.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/cfd1e8d08_dak-prescott.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/90ea7cef1_fortnite-fortnite-quotes.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/fb0742ed1_israel-jew.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/36e034a45_nle-choppa.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/2285ee87c_that-brother-is-going-to-be-delivering-my-doordash-in-the-future.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/7a3e1f6a9_speed-ishowspeed.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/bfe4ff2ed_quote-meme.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/02496b9da_pop-popteamepic.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/d3a5b3ec9_playboi-carti-playboi.gif",
  "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/96705d16d_vlone-anime.gif",
];

const LOGO = "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/b8ba4f2f4_Untitled_presentation-2-removebg-preview.png";

export default function LandingPage({ onEnter }) {
  const [bgGif] = useState(() => GIFS[Math.floor(Math.random() * GIFS.length)]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Background GIF */}
      <img
        src={bgGif}
        alt=""
        className="absolute inset-0 w-full h-full object-fill"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4">
        <motion.img
          src={LOGO}
          alt="PeterStreams"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-64 md:w-[26rem] max-w-full object-contain"
          style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.1))" }}
        />
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onClick={onEnter}
          className="px-12 py-4 bg-white text-black font-bold text-lg uppercase tracking-[0.3em] hover:bg-neutral-300 active:scale-95 transition-all"
        >
          Enter
        </motion.button>
      </div>

      {/* Corner text */}
      <div className="absolute bottom-4 left-4 text-neutral-700 text-xs font-bold uppercase tracking-wider">
        PeterStreams // 2026
      </div>
      <div className="absolute bottom-4 right-4 text-neutral-700 text-xs font-bold uppercase tracking-wider">
        Signal: Strong
      </div>
    </div>
  );
}