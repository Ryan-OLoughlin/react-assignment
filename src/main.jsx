import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import PersonPage from "./pages/personDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import PlaylistsPage from "./pages/playlistsPage";
import SiteHeader from './components/siteHeader';
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from './pages/addMovieReviewPage'
import TrendingMoviesPage from "./pages/trendingMoviesPage";
import TopRatedMoviesPage from "./pages/topRatedMoviesPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import SearchPage from "./pages/searchPage";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SiteHeader />
          <MoviesContextProvider>
            <Routes>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
              <Route path="/movies/top-rated" element={<TopRatedMoviesPage />} />
              <Route path="/movies/trending" element={<TrendingMoviesPage />} />
              <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
              <Route path="/reviews/:id" element={<MovieReviewPage />} />
              <Route path="/reviews/form" element={<AddMovieReviewPage />} />
              <Route path="/movies/:id" element={<MoviePage />} />
              <Route path="/person/:id" element={<PersonPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MoviesContextProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};


const rootElement = createRoot(document.getElementById("root"))
rootElement.render(<App />);
