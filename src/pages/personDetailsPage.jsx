import { useParams } from "react-router";
import usePersonCredits from '../hooks/usePersonCredits'
import { getPersonMovieCredits } from "../api/tmdb-api";
import usePerson from '../hooks/usePerson'
import Spinner from "../components/spinner";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MovieList from "../components/movieList";
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites';

const PersonDetailsPage = () => {
  const { id } = useParams();

  const { person, isPending: personPending, isError: personIsError, error: personError } = usePerson(id);

  const { credits, isPending: creditsPending, isError: creditsIsError, error: creditsError } = usePersonCredits(id);

  if (personPending || creditsPending) return <Spinner />;

  if (personIsError) return <h1>{personError.message}</h1>;
  if (creditsIsError) return <h1>{creditsError.message}</h1>;

  const movies = credits || [];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Avatar
          src={person.profile_path ? `https://image.tmdb.org/t/p/w300/${person.profile_path}` : undefined}
          variant="square"
          sx={{ width: 200, height: 300 }}
        />
        <Box>
          <Typography variant="h4">{person.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {person.known_for_department} {person.birthday ? `• Born ${person.birthday}` : ""} {person.place_of_birth ? `• ${person.place_of_birth}` : ""}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>{person.biography}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Known For</Typography>
        <Grid container>
          <MovieList movies={movies} action={(movie) => <AddToFavoritesIcon movie={movie} />} />
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonDetailsPage;
