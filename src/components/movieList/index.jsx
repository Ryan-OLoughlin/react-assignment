import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid";

const MovieList = (props) => {
  const cols = Number(props.cols) || 5; // default 5 per row
  const percent = `${100 / cols}%`;

  const movieCards = (props.movies || []).map((m) => (
    <Grid
      key={m.id}
      item
      sx={{
        padding: 1,
        // responsive sizing: stack on small, then distribute evenly on larger screens
        boxSizing: 'border-box',
        flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 33.333%', lg: `1 1 ${percent}`, xl: `1 1 ${percent}` },
        // allow items to grow to fill remaining space when there are fewer items than the columns
        minWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: `calc(${percent} - 8px)`, xl: `calc(${percent} - 8px)` },
      }}
    >
      <Movie key={m.id} movie={m} action={props.action} />
    </Grid>
  ));

  return movieCards;
};

export default MovieList;