import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const LOGO = "https://media.base44.com/images/public/6a0e628fba5c07c6a3ea4522/b8ba4f2f4_Untitled_presentation-2-removebg-preview.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies" },
    { label: "TV Shows", path: "/tv" },
    { label: "Trending", path: "/trending" },
    { label: "Live TV", path: "/livetv" },
  ];

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-neutral-800" : "bg-black"
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-10 gap-4">
        <Link to="/" className="flex-shrink-0 h-9 flex items-center">
          <img src={LOGO} alt="PeterStreams" className="h-9 w-auto object-contain" />
        </Link>

        <nav className="flex-1 flex items-center justify-center gap-0.5 md:gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive =
              item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 md:px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 border-b-2 ${
                  isActive
                    ? "text-white border-white"
                    : "text-neutral-500 hover:text-white border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate("/search")}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all"
          >
            <Search size={20} />
          </button>
          <span className="hidden sm:block text-sm font-bold text-neutral-600 tabular-nums">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </header>
  );
}