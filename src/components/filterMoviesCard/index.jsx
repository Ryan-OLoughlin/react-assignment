import { useQuery } from '@tanstack/react-query';
import Spinner from '../spinner';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getGenres } from "../../api/tmdb-api";
import img from '../../images/projector.jpg';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const formControl =
{
    margin: 1,
    minWidth: "99%",
};

export default function FilterMoviesCard(props) {

    const { data, error, isPending, isError } = useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
    });

    if (isPending) {
        return <Spinner />;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }
    const genres = (data && data.genres) || [];
    const genreOptions = (genres[0] && genres[0].name !== 'All')
        ? [{ id: '0', name: 'All' }, ...genres]
        : genres;

    const onUserInput = props.onUserInput;
    const handleTextChange = (e) => onUserInput('name', e.target.value);
    const handleGenreChange = (e) => onUserInput('genre', e.target.value);
    const handleSortByChange = (e) => onUserInput('sortBy', e.target.value);
    const handleSortOrderChange = (e) => onUserInput('sortOrder', e.target.value);
    const handleTypeChange = (e, v) => { if (v) onUserInput('filterType', v); };

    return (
        <Card
            sx={(theme) => ({
                backgroundColor: props.fullWidth ? 'transparent' : theme.palette.background.paper,
                boxShadow: props.fullWidth ? 'none' : undefined,
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: props.fullWidth ? 2 : undefined,
                ...(props.fullWidth ? {
                  backgroundImage: `linear-gradient(rgba(11,27,43,0.45), rgba(11,27,43,0.45)), url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: theme.palette.primary.contrastText,
                } : {}),
            })}
            variant={props.fullWidth ? 'elevation' : 'outlined'}>
            <CardContent>
                <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon sx={{ color: 'primary.main' }} fontSize="large" />
                    Filter the movies.
                </Typography>
                {props.showSearch !== false && (
                <TextField
                    sx={{ ...formControl, backgroundColor: 'rgba(191,87,0,0.06)', borderRadius: 1 }}
                    id="filled-search"
                    label="Search field"
                    type="search"
                    variant="filled"
                    value={props.titleFilter}
                    onChange={handleTextChange}
                />
                )}

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        label="Genre"
                        defaultValue=""
                        value={props.genreFilter}
                        onChange={handleGenreChange}
                    >
                        {genreOptions.map((genre) => {
                            return (
                                <MenuItem key={genre.id} value={genre.id}>
                                    {genre.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="sortby-label">Sort By</InputLabel>
                    <Select
                        labelId="sortby-label"
                        id="sortby-select"
                        label="Sort By"
                        value={props.sortBy || ''}
                        onChange={handleSortByChange}
                    >
                        {props.filterType === 'people' ? (
                            // When filtering people, show person-specific sort options
                            [
                                <MenuItem key="name" value="name">Alphabetical (A-Z)</MenuItem>,
                                <MenuItem key="age" value="age">Age</MenuItem>,
                                <MenuItem key="movie_count" value="movie_count">Total Movie Count</MenuItem>
                            ]
                        ) : (
                            // Default movie sort options
                            [
                                <MenuItem key="title" value="title">Title (A-Z)</MenuItem>,
                                <MenuItem key="release_date" value="release_date">Release Date</MenuItem>,
                                <MenuItem key="vote_average" value="vote_average">Rating</MenuItem>,
                                <MenuItem key="popularity" value="popularity">Popularity</MenuItem>
                            ]
                        )}
                    </Select>
                </FormControl>

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="sortorder-label">Order</InputLabel>
                    <Select
                        labelId="sortorder-label"
                        id="sortorder-select"
                        label="Order"
                        value={props.sortOrder || 'asc'}
                        onChange={handleSortOrderChange}
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>

                                {props.showTypeToggle && (
                                    <ToggleButtonGroup
                                        value={props.filterType || 'movies'}
                                        exclusive
                                        onChange={handleTypeChange}
                                        aria-label="filter type"
                                        sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                                    >
                                        <ToggleButton value="movies">Movies</ToggleButton>
                                        <ToggleButton value="people">People</ToggleButton>
                                    </ToggleButtonGroup>
                                )}
            </CardContent>
            {!props.fullWidth && (
                <CardMedia
                    sx={{ height: 300 }}
                    image={img}
                    title="Filter"
                />
            )}
        </Card>
    );
}