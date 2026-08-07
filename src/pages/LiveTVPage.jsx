import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Loader2, AlertTriangle } from "lucide-react";
import { fetchChannels } from "@/lib/cdnLiveTvApi";
import { CUSTOM_CHANNELS } from "@/data/customChannels";
import ChannelCard from "@/components/livetv/ChannelCard";
import LiveTVFullscreenPlayer from "@/components/livetv/LiveTVFullscreenPlayer";

export default function LiveTVPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cdnChannels = await fetchChannels();
      const custom = CUSTOM_CHANNELS.map((c, i) => ({
        id: `custom-${i}`,
        name: c.name,
        playerUrl: c.embedUrl,
        status: "online",
      }));
      setChannels([...custom, ...cdnChannels]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const PRIORITY = [
    "NBC", "ABC", "CBS", "FOX", "Space City Home Network",
    "ESPN", "ESPN2", "ESPNU", "ESPNEWS", "TNT", "CNN HD", "TBS",
    "FX", "FXX", "FXM", "HBO", "Paramount + with Showtime",
  ];

  const sortByPriority = (list) => {
    const result = [];
    const remaining = [...list];
    for (const name of PRIORITY) {
      const idx = remaining.findIndex((c) => c.name === name);
      if (idx >= 0) {
        result.push(remaining.splice(idx, 1)[0]);
      }
    }
    return [...result, ...remaining];
  };

  const filtered = sortByPriority(
    search.trim()
      ? channels.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      : channels
  );

  return (
    <div className="min-h-screen bg-black pt-8 pb-10">
      <div className="px-4 md:px-10 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3 mb-2 uppercase">
          <Radio size={32} />
          Live TV
        </h1>
        <p className="text-neutral-500 text-sm">
          {channels.length > 0 ? `${channels.length} US channels available` : "Loading channels..."}
        </p>

        <div className="mt-4 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="w-full px-5 py-3 bg-neutral-900 border-2 border-neutral-800 focus:border-white text-white placeholder-neutral-600 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="text-neutral-600 animate-spin" />
          <p className="text-neutral-500 text-sm uppercase tracking-wide">Fetching channels...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertTriangle size={32} className="text-neutral-600" />
          <p className="text-neutral-500 text-sm">Failed to load channels</p>
          <button
            onClick={load}
            className="px-5 py-2.5 bg-white text-black text-sm font-bold uppercase tracking-wide hover:bg-neutral-300 active:scale-95 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="px-4 md:px-10 animate-fade-in">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((channel, idx) => (
                <ChannelCard key={`${channel.id}-${idx}`} channel={channel} onClick={setActiveChannel} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-neutral-500 text-sm">No channels found for "{search}"</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {activeChannel && (
          <LiveTVFullscreenPlayer channel={activeChannel} onClose={() => setActiveChannel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}