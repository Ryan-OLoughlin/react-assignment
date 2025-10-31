import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const AddToFavoritesIcon = ({ movie }) => {
  const context = useContext(MoviesContext);

  const isFav = context.favorites && context.favorites.includes(movie.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (isFav) {
      context.removeFromFavorites(movie);
    } else {
      context.addToFavorites(movie);
    }
  };

  return (
    <IconButton aria-label={isFav ? "remove from favorites" : "add to favorites"} onClick={handleToggleFavorite} aria-pressed={isFav}>
      {isFav ? (
        <FavoriteIcon sx={{ color: 'error.main' }} fontSize="large" />
      ) : (
        <FavoriteBorderIcon sx={{ color: 'error.main' }} fontSize="large" />
      )}
    </IconButton>
  );
};

export default AddToFavoritesIcon;
