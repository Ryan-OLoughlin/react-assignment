import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews"
import LanguageIcon from '@mui/icons-material/Language';
import SavingsIcon from '@mui/icons-material/Savings';
import { getRecommendations } from "../../api/tmdb-api";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie, videos = [], cast = [] }) => {  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const topEnglishOfficialTrailers = videos
    .filter(
      (v) =>
        v.site === "YouTube" &&
        v.official === true &&
        (v.iso_639_1 === "en" || v.iso_639_1 === "en-US" || v.iso_639_1 === "en-GB") &&
        v.type === "Trailer"
    )
    .slice(0, 3);

  let trailersToShow = topEnglishOfficialTrailers;
  if (!trailersToShow.length) {
    trailersToShow = videos
      .filter((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
      .slice(0, 3);
  }

  // Choose grid column size based on how many trailers we will show so they spread out across the page
  const colSize = trailersToShow.length === 1 ? 12 : trailersToShow.length === 2 ? 6 : 4;

  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const openTrailer = (t) => setSelectedTrailer(t);
  const closeTrailer = () => setSelectedTrailer(null);

  return (
    <>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper
        component="ul"
        sx={{ ...root }}
      >
        <li>
          <Chip label="Genres" sx={{ ...chip }} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>

      <Paper component="ul" sx={{ ...root }}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip
          icon={<MonetizationIcon />}
          label={`${movie.revenue.toLocaleString()}`}
        />
        <Chip
          icon={<StarRate />}
          label={`${movie.vote_average} (${movie.vote_count})`}
        />
        <Chip
          icon={<LanguageIcon />}
          label={`Original Language ${movie.original_language}`}
        />
        <Chip 
          icon={<SavingsIcon />}
          label={`Budget: ${(Math.abs(Number(movie.budget)) / 1.0e+6).toFixed(0) + "m"}`}
        />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em'
        }}
      >
        <NavigationIcon />
        Reviews
      </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

      {trailersToShow.length > 0 && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <Typography variant="h6">Videos</Typography>
          <Grid container spacing={2} sx={{ mt: 1, width: "100%" }} alignItems="stretch">
            {trailersToShow.map((v) => (
              <Grid
                item
                key={v.id}
                xs={12}
                sm={trailersToShow.length === 1 ? 12 : 6}
                md={colSize}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  onClick={() => openTrailer(v)}
                  sx={{
                    width: { xs: "100%", sm: 320, md: 420 },
                    cursor: "pointer",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    height: { xs: 220, sm: 260, md: 300 },
                    minWidth: { sm: 320 },
                  }}
                >
                  <Box sx={{ position: "relative", height: "70%" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(https://img.youtube.com/vi/${v.key}/hqdefault.jpg)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.2)",
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 48, color: "white" }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ height: "30%", py: 1 }}>
                    <Typography variant="subtitle2" noWrap sx={{ textOverflow: 'ellipsis' }}>
                      {v.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={!!selectedTrailer} onClose={closeTrailer} maxWidth="md" fullWidth>
            <IconButton
              aria-label="close"
              onClick={closeTrailer}
              sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1300 }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent sx={{ pt: 4 }}>
              {selectedTrailer && (
                <Box sx={{ position: 'relative', pt: '56.25%' }}>
                  <iframe
                    title={selectedTrailer.name}
                    src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      )}

      {cast && cast.length > 0 && (
        <Box sx={{ mt: 3, width: "100%" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Cast
          </Typography>
          <Grid container spacing={2}>
            {cast.slice(0, 12).map((c) => (
              <Grid key={c.cast_id || c.credit_id || c.id} xs={6} sm={4} md={3} lg={2}>
                <Link to={`/person/${c.id}`}>
                  <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1 }}>
                    <Avatar
                      src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined}
                      alt={c.name}
                      sx={{ width: 88, height: 88, mb: 1 }}
                    />
                    <Typography variant="subtitle2" noWrap sx={{ textAlign: "center" }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ textAlign: "center" }}>
                      {c.character}
                    </Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    </>
  );
};
export default MovieDetails;