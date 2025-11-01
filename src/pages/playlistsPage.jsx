import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import { MoviesContext } from "../contexts/moviesContext";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import img from '../images/film-poster-placeholder.png';
import Paper from "@mui/material/Paper";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router";

const PlaylistsPage = () => {
  const { playlists, deletePlaylist, removeMovieFromPlaylist } = useContext(MoviesContext);
  const [moviesMap, setMoviesMap] = useState({}); // playlistId -> [movie]
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      const newMap = {};
      for (const pl of playlists) {
        if (!pl.movieIds || pl.movieIds.length === 0) {
          newMap[pl.id] = [];
          continue;
        }
        try {
          // use getMovie (same shape as other api helpers)
          const movies = await Promise.all(
            pl.movieIds.map((id) => getMovie({ queryKey: ["movie", { id }] }))
          );
          newMap[pl.id] = movies;
        } catch (e) {
          newMap[pl.id] = [];
        }
      }
      if (mounted) {
        setMoviesMap(newMap);
        setLoading(false);
      }
    };
    fetchAll();
    return () => (mounted = false);
  }, [playlists]);

  if (!playlists || playlists.length === 0) {
    return (
      <Container>
        <Typography variant="h4" component="h2" gutterBottom>
          Your Playlists
        </Typography>
        <Typography>No playlists yet. Go add some from a movie card.</Typography>
        <Link to="/">Back to Home</Link>
      </Container>
    );
  }

  return (
    <Container>
      <Paper 
        component="div" 
        sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            padding: 1.5,
            margin: 0,
        }}
      >
      <IconButton aria-label="go back" onClick={() => navigate(-1)} >
        <ArrowBackIcon color="primary" fontSize="large" />
      </IconButton>

      <Typography variant="h4" component="h3">
        Your Playlists
        </Typography>

      <IconButton aria-label="go forward" onClick={() => navigate(+1) } >
        <ArrowForwardIcon color="primary" fontSize="large" />
      </IconButton>
    </Paper>

      {loading ? (
        <Spinner />
      ) : (
        <Grid container spacing={2}>
                      {playlists.map((pl) => (
            <Grid xs={12} key={pl.id}>
              <Card>
                <CardHeader
                  title={pl.name}
                  action={
                    <div>
                      <IconButton aria-label="delete playlist" onClick={() => deletePlaylist(pl.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                />
                <CardContent>
                  {(!moviesMap[pl.id] || moviesMap[pl.id].length === 0) ? (
                    <Typography variant="body2">No movies in this playlist.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {moviesMap[pl.id].map((movie) => (
                        <Grid xs={12} sm={6} md={3} key={movie.id}>
                          <Card>
                            <CardMedia
                              component="img"
                              sx={{ height: 300 }}
                              image={
                                movie.poster_path
                                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                  : img
                              }
                              alt={movie.title}
                            />
                            <CardContent>
                              <Typography variant="h6">{movie.title}</Typography>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <Button size="small" variant="outlined" component={Link} to={`/movies/${movie.id}`}>
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  color="secondary"
                                  variant="contained"
                                  onClick={() => removeMovieFromPlaylist(pl.id, movie.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PlaylistsPage;