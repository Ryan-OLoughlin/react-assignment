import React, { useState, useEffect } from "react";

export const MoviesContext = React.createContext(null);

const STORAGE_KEY = "tmdb_playlists_v1";

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
    }
  }, []);

  // persist playlists on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (e) {
    }
  }, [playlists]);

  // load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      if (raw) setFavorites(JSON.parse(raw).map((m) => m.id || m));
    } catch (e) {
    }
  }, []);

  // persist favorites to localStorage whenever they change (store as array of ids)
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites.map((id) => id)));
    } catch (e) {
    }
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      if (!prev.includes(movie.id)) return [...prev, movie.id];
      return prev;
    });
  };

  // We will use this function in the next step
  const removeFromFavorites = (movie) => {
    setFavorites((prev) => prev.filter((mId) => mId !== movie.id));
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
