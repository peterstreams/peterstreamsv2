const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNWMxMzVjMGQ3ZjAzODJjMzUyNmY3YzQ5MDUzNTI4ZiIsIm5iZiI6MTc3OTMyOTcyOS4xMjMwMDAxLCJzdWIiOiI2YTBlNmFjMTQxOTcxYzRiMWMzOGNlNmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JuXuxxLADOo-y6iltr-R45gyo_7Z2PuI1OSpUPZ302k";
export const API_KEY = BEARER_TOKEN;
const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";

const cache = new Map();

async function fetchTMDB(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const key = url.toString();
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
  if (!res.ok) {
    console.error(`TMDB error ${res.status} for ${path}`);
    return { results: [] };
  }
  const data = await res.json();
  if (data.results !== undefined) cache.set(key, data);
  return data;
}

export const tmdb = {
  trending: (page = 1) => fetchTMDB("/trending/movie/week", { page }),
  trendingAll: (page = 1) => fetchTMDB("/trending/all/week", { page }),
  trendingTV: (page = 1) => fetchTMDB("/trending/tv/week", { page }),
  popularMovies: (page = 1) => fetchTMDB("/movie/popular", { page }),
  topRatedMovies: (page = 1) => fetchTMDB("/movie/top_rated", { page }),
  nowPlaying: (page = 1) => fetchTMDB("/movie/now_playing", { page }),
  discoverMovies: (params = {}) => fetchTMDB("/discover/movie", { sort_by: "popularity.desc", ...params }),
  movieDetails: (id) => fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,similar,release_dates" }),
  similarMovies: (id) => fetchTMDB(`/movie/${id}/similar`),
  popularTV: (page = 1) => fetchTMDB("/tv/popular", { page }),
  topRatedTV: (page = 1) => fetchTMDB("/tv/top_rated", { page }),
  discoverTV: (params = {}) => fetchTMDB("/discover/tv", { sort_by: "popularity.desc", ...params }),
  tvDetails: (id) => fetchTMDB(`/tv/${id}`, { append_to_response: "credits,videos,similar,content_ratings" }),
  similarTV: (id) => fetchTMDB(`/tv/${id}/similar`),
  tvSeason: (id, season) => fetchTMDB(`/tv/${id}/season/${season}`),
  search: (query, page = 1) => fetchTMDB("/search/multi", { query, page, include_adult: false }),
  movieGenres: () => fetchTMDB("/genre/movie/list"),
  tvGenres: () => fetchTMDB("/genre/tv/list"),
};

export function posterUrl(path, size = "w342") {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}
export function backdropUrl(path, size = "w1280") {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}
export function stillUrl(path, size = "w500") {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}
export function profileUrl(path, size = "w185") {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}