import React from "react";
import { useParams } from 'react-router';
import PageTemplate from "../components/templateMoviePage";
import MovieDetails from "../components/movieDetails";
import { getMovie } from '../api/tmdb-api'
import { useQuery } from '@tanstack/react-query';
import useMovieVideos from '../hooks/useMovieVideos'
import useMovieCast from '../hooks/useMovieCast'
import Spinner from '../components/spinner'


const MoviePage = (props) => {
  const { id } = useParams();

  const { data: movie, error, isPending, isError } = useQuery({
    queryKey: ['movie', { id: id }],
    queryFn: getMovie,
  })

  const { trailers, isPending: videosPending, isError: videosError, error: videosErrorObj } = useMovieVideos(id);
  const videos = trailers;

  const { cast, isPending: castPending, isError: castError, error: castErrorObj } = useMovieCast(id);

  // Show spinner until movie, videos, and cast are loaded
  if (isPending || videosPending || castPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (videosError) {
    return <h1>{videosErrorObj?.message || 'Error loading videos'}</h1>;
  }

  if (castError) {
    return <h1>{castErrorObj?.message || 'Error loading cast'}</h1>;
  }


  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
            <MovieDetails movie={movie} videos={videos} cast={cast} />
          </PageTemplate>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MoviePage;
