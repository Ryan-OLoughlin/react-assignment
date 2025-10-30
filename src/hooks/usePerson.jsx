import { useQuery } from "@tanstack/react-query";
import { getPerson } from "../api/tmdb-api";

const usePerson = (personId) => {
  const query = useQuery({
    queryKey: ["person", { id: personId }],
    queryFn: getPerson,
    enabled: !!personId,
  });

  const person = query.data || null;

  return {
    person,
    isPending: query.isLoading,
    isError: query.isError,
    error: query.error,
    query,
  };
};

export default usePerson;
