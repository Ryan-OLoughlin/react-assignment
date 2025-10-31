import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { Link } from "react-router";
import Header from "../components/headerMovieList";
import useSearchMovies from "../hooks/useSearchMovies";
import useSearchPeople from "../hooks/useSearchPeople";
import { getPerson } from "../api/tmdb-api";
import MovieList from "../components/movieList";
import Spinner from "../components/spinner";
import FilterCard from "../components/filterMoviesCard";

const SearchPage = () => {
  const [term, setTerm] = useState("");
  // committed query used to run searches (set when user clicks Search)
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("movies"); // 'movies' or 'people'
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [genreFilter, setGenreFilter] = useState("0");
  const [filterType, setFilterType] = useState("movies");

  const topRef = useRef(null);

  // per-session cache for person ages (avoid refetching same person)
  const peopleAgesCache = useRef({});
  const [peopleAges, setPeopleAges] = useState({});
  const [peopleAgesLoading, setPeopleAgesLoading] = useState(false);

  // Diagnostics
  if (typeof window !== "undefined") {
    try {
      console.log(
        "[SearchPage] invoking hooks with searchQuery=",
        JSON.stringify(searchQuery),
        "type=",
        type,
        "page=",
        page
      );
    } catch {}
  }

  // Data hooks
  const {
    movies,
    totalPages: moviesTotalPages,
    isPending: moviesPending,
  } = useSearchMovies(type === "movies" ? searchQuery : "", page);

  const {
    people,
    totalPages: peopleTotalPages,
    isPending: peoplePending,
  } = useSearchPeople(type === "people" ? searchQuery : "", page);

  const isLoading =
    (type === "movies" && moviesPending) ||
    (type === "people" && peoplePending);

  // Actions
  const onSearch = () => {
    const q = (term || "").toString().trim();
    setSearchQuery(q);
    setPage(1);
  };

  const handleSearchPageChange = (e, value) => {
    setPage(value);
    if (topRef && topRef.current) {
      try {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset page when query or filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, type, sortBy, sortOrder, genreFilter]);

  const handleFilterChange = (t, v) => {
    if (t === "name") setTerm(v);
    else if (t === "sortBy") setSortBy(v);
    else if (t === "sortOrder") setSortOrder(v);
    else if (t === "filterType") {
      setFilterType(v);
      setType(v);
    } else if (t === "genre") {
      setGenreFilter(String(v));
    }
  };

  // Sorting / filtering helpers (movies)
  const applyMovieSort = (list = [], sortBy, sortOrder) => {
    if (!list) return [];
    if (!sortBy) return list;
    const dir = sortOrder === "asc" ? 1 : -1;
    return list.slice().sort((a, b) => {
      if (sortBy === "title" || sortBy === "name") {
        const A = (a.title || a.name || "").toLowerCase();
        const B = (b.title || b.name || "").toLowerCase();
        return A.localeCompare(B) * dir;
      }
      if (sortBy === "release_date") {
        const A = a.release_date ? Date.parse(a.release_date) : 0;
        const B = b.release_date ? Date.parse(b.release_date) : 0;
        return (A - B) * dir;
      }
      if (sortBy === "vote_average" || sortBy === "popularity") {
        const A = Number(a[sortBy] || 0);
        const B = Number(b[sortBy] || 0);
        return (A - B) * dir;
      }
      return 0;
    });
  };

  const applyGenreFilter = (list = [], genreId) => {
    if (!list) return [];
    const gid = Number(genreId || 0);
    if (!gid || gid <= 0) return list;
    return list.filter(
      (m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(gid)
    );
  };

  // Sorting helper (people)
  const applyPeopleSort = (list = [], sortBy, sortOrder) => {
    if (!list) return [];
    const actors = list.filter((p) => {
      if (!p) return false;
      if ((p.known_for_department || "").toLowerCase() !== "acting")
        return false;
      const name = (p.name || "").trim();
      return name.split(/\s+/).length >= 2;
    });
    if (!sortBy) return actors;
    const dir = sortOrder === "asc" ? 1 : -1;
    return actors.slice().sort((a, b) => {
      if (sortBy === "name" || sortBy === "title") {
        const A = (a.name || "").toLowerCase();
        const B = (b.name || "").toLowerCase();
        return A.localeCompare(B) * dir;
      }
      if (sortBy === "popularity") {
        const A = Number(a.popularity || 0);
        const B = Number(b.popularity || 0);
        return (A - B) * dir;
      }
      if (sortBy === "movie_count") {
        const A = Array.isArray(a.known_for) ? a.known_for.length : 0;
        const B = Array.isArray(b.known_for) ? b.known_for.length : 0;
        return (A - B) * dir;
      }
      if (sortBy === "age") {
        const A =
          typeof peopleAges === "object" && peopleAges[a.id] != null
            ? peopleAges[a.id]
            : null;
        const B =
          typeof peopleAges === "object" && peopleAges[b.id] != null
            ? peopleAges[b.id]
            : null;
        if (A === null && B === null) return 0;
        if (A === null) return 1 * dir; // unknown ages go last
        if (B === null) return -1 * dir;
        return (A - B) * dir;
      }
      return 0;
    });
  };

  // When sorting by age, fetch person details (batched, cached)
  useEffect(() => {
    let cancelled = false;
    const loadAges = async () => {
      if (type !== "people" || sortBy !== "age" || !people || people.length === 0)
        return;
      const ids = people.map((p) => p.id).filter(Boolean);
      const missing = ids.filter((id) => !(id in peopleAgesCache.current));
      if (missing.length === 0) {
        const map = {};
        ids.forEach((id) => {
          map[id] =
            peopleAgesCache.current[id] !== undefined
              ? peopleAgesCache.current[id]
              : null;
        });
        setPeopleAges(map);
        return;
      }
      setPeopleAgesLoading(true);
      try {
        const batchSize = 4;
        for (let i = 0; i < missing.length; i += batchSize) {
          const batch = missing.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map(async (id) => {
              try {
                const details = await getPerson(id);
                return {
                  id,
                  birthday: details && details.birthday ? details.birthday : null,
                };
              } catch {
                return { id, birthday: null };
              }
            })
          );
          if (cancelled) return;
          const now = new Date();
          results.forEach((r) => {
            if (r && r.birthday) {
              const b = new Date(r.birthday);
              let age = now.getFullYear() - b.getFullYear();
              const m = now.getMonth() - b.getMonth();
              if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
              peopleAgesCache.current[r.id] = age;
            } else {
              peopleAgesCache.current[r.id] = null;
            }
          });
        }
        if (cancelled) return;
        const map = {};
        ids.forEach((id) => {
          map[id] =
            peopleAgesCache.current[id] !== undefined
              ? peopleAgesCache.current[id]
              : null;
        });
        setPeopleAges(map);
      } finally {
        if (!cancelled) setPeopleAgesLoading(false);
      }
    };
    loadAges();
    return () => {
      cancelled = true;
    };
  }, [people, sortBy, type]);

  return (
    <Grid container>
      {/* Header full width */}
      <Grid size={12} ref={topRef}>
        <Header title="Search" />
      </Grid>

      {/* Main container row (same as template) */}
      <Grid container sx={{ flex: "1 1 500px" }}>
        {/* Left column: Search box + Filter card (like Home's left rail) */}
        <Grid
          key="find"
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          sx={{ padding: "20px" }}
        >
          {/* Search box sits above the filter, below the header */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TextField
              label="Search term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              fullWidth
            />
            <Button variant="contained" onClick={onSearch}>
              Search
            </Button>
          </Box>

          <FilterCard
            onUserInput={handleFilterChange}
            titleFilter={term}
            sortBy={sortBy}
            sortOrder={sortOrder}
            filterType={filterType}
            showTypeToggle={true}
          />
        </Grid>

        {/* Right column: Results list (movies/people) */}
        <Grid
          key="list"
          size={{ xs: 12, sm: 6, md: 8, lg: 9, xl: 10 }}
          sx={{ padding: "20px", display: "flex", flexDirection: "column" }}
        >
          {isLoading && <Spinner />}

          {/* Movies */}
          {!isLoading && type === "movies" && (
            <>
              <Grid container>
                <MovieList
                  movies={applyMovieSort(
                    applyGenreFilter(movies, genreFilter),
                    sortBy,
                    sortOrder
                  )}
                  action={() => null}
                  cols={5}
                />
              </Grid>

              {moviesTotalPages > 1 && (
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 4 }}
                >
                  <Pagination
                    count={moviesTotalPages}
                    page={page}
                    onChange={handleSearchPageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "1.05rem",
                        minWidth: 40,
                        minHeight: 40,
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* People */}
          {!isLoading && type === "people" && (
            <>
              {sortBy === "age" && peopleAgesLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                  <Spinner />
                  <Typography>
                    Loading ages for people (this may make a few additional API requests)...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {applyPeopleSort(people, sortBy, sortOrder).map((p) => (
                    <Grid
                      key={p.id}
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      sx={{ padding: 2 }}
                    >
                      <Card>
                        <CardHeader
                          avatar={
                            <Avatar
                              src={
                                p.profile_path
                                  ? `https://image.tmdb.org/t/p/w200/${p.profile_path}`
                                  : undefined
                              }
                              alt={p.name}
                            />
                          }
                          title={<Link to={`/person/${p.id}`}>{p.name}</Link>}
                          subheader={p.known_for_department}
                        />
                        <CardContent>
                          {p.known_for && p.known_for.length > 0 && (
                            <Typography variant="body2">
                              Known for:{" "}
                              {p.known_for
                                .map((k) => k.title || k.name)
                                .filter(Boolean)
                                .slice(0, 3)
                                .join(", ")}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {peopleTotalPages > 1 && (
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 4 }}
                >
                  <Pagination
                    count={peopleTotalPages}
                    page={page}
                    onChange={handleSearchPageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "1.05rem",
                        minWidth: 40,
                        minHeight: 40,
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchPage;
