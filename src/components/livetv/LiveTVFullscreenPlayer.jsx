import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

// Trusted hosts for embeds — update this list if you add/remove providers.
const TRUSTED_HOSTS = [
  "media.base44.com",
  "cdn.base44.com",
  "vidsrc.to",
  "player.vimeo.com",
  "youtube.com",
  "www.youtube.com",
  "player.twitch.tv",
];

function isDirectStream(url) {
  if (!url) return false;
  return /\.(m3u8|mp4|mpd)(\?.*)?$/i.test(url);
}

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return null;
  }
}

export default function LiveTVFullscreenPlayer({ channel, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const videoRef = useRef(null);

  const src = channel?.playerUrl || channel?.embedUrl || channel?.url || "";
  const hostname = getHostname(src);
  const allowed = hostname ? TRUSTED_HOSTS.includes(hostname) : false;

  useEffect(() => {
    setLoaded(false);
    setBlocked(false);
    // block untrusted hosts
    if (src && !allowed) {
      setBlocked(true);
      return;
    }
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [channel?.id, src, allowed]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    // If it's an HLS stream and the browser does not natively support it, try to load hls.js from CDN
    if (isDirectStream(src) && /\.m3u8(\?.*)?$/i.test(src)) {
      const video = videoRef.current;
      if (!video) return;

      const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl');
      if (canPlayNative) return;

      if (window.Hls) {
        tryAttachHls(window.Hls, video, src);
        return;
      }

      const scriptId = "hlsjs-cdn-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.async = true;
        script.onload = () => {
          if (window.Hls) tryAttachHls(window.Hls, video, src);
        };
        script.onerror = () => {
          console.warn("Failed to load hls.js from CDN");
        };
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.Hls) {
            clearInterval(interval);
            tryAttachHls(window.Hls, video, src);
          }
        }, 200);
        return () => clearInterval(interval);
      }
    }
  }, [src]);

  function tryAttachHls(HlsLib, videoEl, url) {
    try {
      if (HlsLib.isSupported()) {
        const hls = new HlsLib();
        hls.loadSource(url);
        hls.attachMedia(videoEl);
        hls.on(HlsLib.Events.MANIFEST_PARSED, function () {
          videoEl.play().catch(() => {});
        });
      }
    } catch (e) {
      console.warn("Failed to attach hls.js", e);
    }
  }

  if (!channel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black flex items-center justify-center"
    >
      <div className="w-full max-w-[1200px] h-[72vh] bg-black relative rounded overflow-hidden">
        {!loaded && !blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
            <Loader2 size={36} className="text-white animate-spin" />
            <p className="text-white/60 text-sm">Loading {channel.name}...</p>
          </div>
        )}

        {blocked ? (
          <div className="w-full h-full flex items-center justify-center p-6 text-center">
            <div className="max-w-lg text-white">
              <h2 className="text-xl font-bold mb-2">Blocked untrusted player</h2>
              <p className="mb-4 text-neutral-300">This channel's player is hosted on an untrusted domain ({hostname}) and has been blocked to prevent pop-ups or redirects.</p>
              <p className="text-neutral-400 text-sm">If you trust this source, add it to TRUSTED_HOSTS in src/components/livetv/LiveTVFullscreenPlayer.jsx and redeploy.</p>
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-white text-black font-bold rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : isDirectStream(src) ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            playsInline
            src={src}
            onCanPlay={() => setLoaded(true)}
          />
        ) : (
          // Sandboxed iframe for other embeds — intentionally restrictive
          <iframe
            src={src}
            title={channel.name || "LiveTV Player"}
            className="w-full h-full border-0"
            // For trusted hosts we allow scripts + same-origin so embeds function, but we DO NOT allow popups or top navigation
            sandbox={allowed ? "allow-scripts allow-same-origin" : ""}
            allow={"autoplay; picture-in-picture; encrypted-media"}
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 bg-black/70 hover:bg-black/90 text-white transition-all backdrop-blur-sm"
          title="Exit (Esc)"
        >
          <X size={16} />
        </button>

        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-semibold uppercase tracking-wider truncate max-w-[160px]">{channel.name}</span>
        </div>
      </div>
    </motion.div>
  );
}
