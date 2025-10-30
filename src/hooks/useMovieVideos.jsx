import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../api/tmdb-api";

const useMovieVideos = (movieId) => {
  const query = useQuery({
    queryKey: ["videos", { id: movieId }],
    queryFn: getVideos,
    enabled: !!movieId,
  });

  const videos = (query.data && query.data.results) || [];

  const trailers = videos.filter(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return {
    trailers,
    isPending: query.isLoading,
    isError: query.isError,
    error: query.error,
    query,
  };
};

export default useMovieVideos;
