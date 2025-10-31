import { useQuery } from "@tanstack/react-query";
import { getSearchPeople } from "../api/tmdb-api";

const useSearchPeople = (query, page = 1, options = {}) => {
  const queryKey = ["searchPeople", { query, page }];

  const queryFn = getSearchPeople;

  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled: !!query,
    keepPreviousData: true,
    ...options,
  });

  const people = (queryResult.data && queryResult.data.results) || [];

  const totalPages = (queryResult.data && queryResult.data.total_pages) || 0;
  const totalResults = (queryResult.data && queryResult.data.total_results) || 0;

  return {
    people,
    totalPages,
    totalResults,
    isPending: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    query: queryResult,
  };
};

export default useSearchPeople;