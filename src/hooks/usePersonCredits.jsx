import { useQuery } from "@tanstack/react-query";
import { getPersonMovieCredits } from "../api/tmdb-api";

const usePersonCredits = (personId) => {
  const query = useQuery({
    queryKey: ["personCredits", { id: personId }],
    queryFn: getPersonMovieCredits,
    enabled: !!personId,
  });

  const credits = (query.data && query.data.cast) || [];

  return {
    credits,
    isPending: query.isLoading,
    isError: query.isError,
    error: query.error,
    query,
  };
};

export default usePersonCredits;
