import React, { useState, useEffect } from "react";

export const MoviesContext = React.createContext(null);

const STORAGE_KEY = "rmdb_playlists_v1";

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const [playlists, setPlaylists] = useState([]);

  // load playlists from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlaylists(JSON.parse(raw));
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // persist playlists on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (e) {
      // ignore write errors
    }
  }, [playlists]);

  const addToFavorites = (movie) => {
    let newFavorites = [];
    if (!favorites.includes(movie.id)) {
      newFavorites = [...favorites, movie.id];
    } else {
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites);
  };

  // We will use this function in the next step
  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((mId) => mId !== movie.id));
  };

  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  // --- Playlists API ---
  const generateId = () => `${Date.now()}`;

  // playlist shape: { id, name, movieIds: [] }
  const createPlaylist = (name = "New Playlist") => {
    const newList = { id: generateId(), name, movieIds: [] };
    setPlaylists((p) => [...p, newList]);
    return newList.id;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((p) => p.filter((pl) => pl.id !== playlistId));
  };

  const renamePlaylist = (playlistId, newName) => {
    setPlaylists((p) => p.map((pl) => (pl.id === playlistId ? { ...pl, name: newName } : pl)));
  };

  const addMovieToPlaylist = (playlistId, movie) => {
    const movieId = typeof movie === "object" ? movie.id : movie;
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId && !pl.movieIds.includes(movieId) ? { ...pl, movieIds: [...pl.movieIds, movieId] } : pl
      )
    );
  };

  const removeMovieFromPlaylist = (playlistId, movieId) => {
    setPlaylists((p) =>
      p.map((pl) => (pl.id === playlistId ? { ...pl, movieIds: pl.movieIds.filter((m) => m !== movieId) } : pl))
    );
  };

  const clearPlaylist = (playlistId) => {
    setPlaylists((p) => p.map((pl) => (pl.id === playlistId ? { ...pl, movieIds: [] } : pl)));
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        addReview,
        myReviews,
        playlists,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addMovieToPlaylist,
        removeMovieFromPlaylist,
        clearPlaylist,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
