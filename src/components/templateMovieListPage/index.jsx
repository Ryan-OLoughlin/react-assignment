import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

function MovieListPageTemplate({ movies, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const genreId = Number(genreFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // reset page when filters or source movies change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, genreFilter, sortBy, sortOrder, movies]);
  const topRef = React.useRef(null);

  let displayedMovies = movies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    });

  // apply sorting if requested
  if (sortBy) {
    displayedMovies = displayedMovies.slice().sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'title') {
        const A = (a.title || a.name || '').toString().toLowerCase();
        const B = (b.title || b.name || '').toString().toLowerCase();
        return A.localeCompare(B) * dir;
      }
      if (sortBy === 'release_date') {
        const A = a.release_date ? Date.parse(a.release_date) : 0;
        const B = b.release_date ? Date.parse(b.release_date) : 0;
        return (A - B) * dir;
      }
      if (sortBy === 'vote_average' || sortBy === 'popularity') {
        const A = Number(a[sortBy] || 0);
        const B = Number(b[sortBy] || 0);
        return (A - B) * dir;
      }
      return 0;
    });
  }

  const totalPages = Math.max(1, Math.ceil(displayedMovies.length / itemsPerPage));
  const pagedMovies = displayedMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "genre") setGenreFilter(value);
    else if (type === "sortBy") setSortBy(value);
    else if (type === "sortOrder") setSortOrder(value);
  };

  return (
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>
      {/* Filter as a full-width top form */}
      <Grid container sx={{ flex: "1 1 500px", width: '100%', paddingX: 2, paddingTop: 2 }}>
        <Grid item xs={12} sx={{ width: '100%' }}>
            <FilterCard
              fullWidth
              onUserInput={handleChange}
              titleFilter={nameFilter}
              genreFilter={genreFilter}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
        </Grid>

        <Grid 
          key="list" 
          item xs={12}
          sx={{padding: 2, display: 'flex', flexDirection: 'column'}}
        >
          <Grid container>
            <MovieList action={action} movies={pagedMovies}></MovieList>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => {
                setCurrentPage(value);
                // scroll to top of this template
                if (topRef && topRef.current) {
                  try { topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {}
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              color="primary"
              size="large"
              sx={{ '& .MuiPaginationItem-root': { fontSize: '1.05rem', minWidth: 40, minHeight: 40 } }}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;