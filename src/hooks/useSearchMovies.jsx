import { useQuery } from "@tanstack/react-query";
import { getSearchMovies } from "../api/tmdb-api";

const useSearchMovies = (query, page = 1, options = {}) => {
  const queryKey = ["searchMovies", { query, page }];

  const queryFn = getSearchMovies;

  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled: !!query,
    keepPreviousData: true,
    ...options,
  });

  const movies = (queryResult.data && queryResult.data.results) || [];

  const totalPages = (queryResult.data && queryResult.data.total_pages) || 0;
  const totalResults = (queryResult.data && queryResult.data.total_results) || 0;

  return {
    movies,
    totalPages,
    totalResults,
    isPending: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    query: queryResult,
  };
};

export default useSearchMovies;