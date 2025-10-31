import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../api/tmdb-api";

const useRecommendations = (movieId) => {
  const query = useQuery({
    queryKey: ["recommendations", { id: movieId }],
    queryFn: getRecommendations,
    enabled: !!movieId,
  });

  const recommendations = (query.data && query.data.results) || [];

  return {
    recommendations,
    isPending: query.isLoading,
    isError: query.isError,
    error: query.error,
    query,
  };
};

export default useRecommendations;
