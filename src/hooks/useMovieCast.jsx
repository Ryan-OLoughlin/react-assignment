import { useQuery } from "@tanstack/react-query";
import { getCast } from "../api/tmdb-api";

const useMovieCast = (movieId) => {
  const query = useQuery({
    queryKey: ["cast", { id: movieId }],
    queryFn: getCast,
    enabled: !!movieId,
  });

  const cast = (query.data && query.data.cast) || [];

  return {
    cast,
    isPending: query.isLoading,
    isError: query.isError,
    error: query.error,
    query,
  };
};

export default useMovieCast;
