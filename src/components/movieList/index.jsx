import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid";

const MovieList = (props) => {
  const cols = Number(props.cols) || 5; // default 5 per row
  const percent = `${100 / cols}%`;

  const movieCards = (props.movies || []).map((m) => (
    <Grid
      key={m.id}
      sx={{
        padding: "20px",
        // responsive sizing: stack on small, then use percentage-based width on larger screens
        boxSizing: 'border-box',
        flexBasis: { xs: "100%", sm: "50%", md: "33.333%", lg: percent, xl: percent },
        maxWidth: { xs: "100%", sm: "50%", md: "33.333%", lg: percent, xl: percent },
      }}
    >
      <Movie key={m.id} movie={m} action={props.action} />
    </Grid>
  ));

  return movieCards;
};

export default MovieList;