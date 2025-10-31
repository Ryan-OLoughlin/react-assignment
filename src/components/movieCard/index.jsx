import React, { useContext  } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import { Link } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from '../../images/film-poster-placeholder.png';
import PlaylistIcon from '../cardIcons/playlist';

export default function MovieCard({ movie, action }) { 

  const { favorites } = useContext(MoviesContext);

  movie.favorite = !!favorites.find((id) => id === movie.id);

  return (
    <Card sx={{
      transition: 'transform .22s ease, box-shadow .22s ease',
      '&:hover': { transform: 'translateY(-6px) scale(1.02)', boxShadow: 6 },
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <CardHeader
        title={
          <Typography variant="h6" component="p" align="center">
            {movie.title}
          </Typography>
        }
        sx={{
          '& .MuiCardHeader-content': { width: '100%' },
          justifyContent: 'center'
        }}
      />

      <CardMedia
        component="img"
        sx={{ aspectRatio: '2/3', objectFit: 'cover', width: '100%' }}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : img
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" component="p" color="text.secondary">
              <CalendarIcon fontSize="small" />
              {` ${movie.release_date || 'N/A'}`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" component="p" color="text.secondary">
              <StarRateIcon fontSize="small" />
              {` ${movie.vote_average || '0'}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>

        {action(movie)}
        <PlaylistIcon movie={movie} />

        <Link to={`/movies/${movie.id}`}>
            <Button variant="outlined" size="medium" color="secondary" sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}>
              More Info ...
            </Button>
          </Link>

      </CardActions>

    </Card>
  );
}