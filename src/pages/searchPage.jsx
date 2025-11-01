import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Header from "../components/headerMovieList";
import useSearchMovies from "../hooks/useSearchMovies";
import MovieList from "../components/movieList";
import Spinner from "../components/spinner";
import FilterCard from "../components/filterMoviesCard";

const SearchPage = () => {
  const [term, setTerm] = useState("");
  // committed query used to run searches (set when user clicks Search)
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [genreFilter, setGenreFilter] = useState("0");

  const topRef = useRef(null);

  // Data hooks
  const {
    movies,
    totalPages: moviesTotalPages,
    isPending: moviesPending,
  } = useSearchMovies(searchQuery, page);

  const isLoading = moviesPending;

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
  }, [searchQuery, sortBy, sortOrder, genreFilter]);

  const handleFilterChange = (t, v) => {
    if (t === "name") setTerm(v);
    else if (t === "sortBy") setSortBy(v);
    else if (t === "sortOrder") setSortOrder(v);
    else if (t === "genre") {
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

  

  

  return (
    <Grid container>
      {/* Header full width */}
      <Grid size={12} ref={topRef}>
        <Header title="Search" />
      </Grid>

      <Grid container sx={{ flex: "1 1 500px" }}>
        <Grid item xs={12} sx={{ width: '100%', paddingX: 2, paddingTop: 2 }}>
          <div className="container">
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <TextField
                label="Search term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                fullWidth
                color="primary"
              />
              <Button variant="contained" color="primary" onClick={onSearch}>
                Search
              </Button>
            </Box>

            <FilterCard
              fullWidth
              onUserInput={handleFilterChange}
              showSearch={false}
              titleFilter={term}
              sortBy={sortBy}
              sortOrder={sortOrder}
              filterType={"movies"}
              showTypeToggle={false}
            />
          </div>
        </Grid>

        {/* Results list (movies/people) */}
        <Grid
          key="list"
          item xs={12}
          sx={{ padding: 2, display: "flex", flexDirection: "column" }}
        >
          {isLoading && <Spinner />}

          {/* Movies */}
          {!isLoading && movies && (
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchPage;
